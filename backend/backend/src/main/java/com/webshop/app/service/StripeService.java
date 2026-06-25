package com.webshop.app.service;

import com.webshop.app.entity.Order;
import com.webshop.app.entity.OrderItem;
import com.webshop.app.entity.Payment;
import com.webshop.app.entity.User;
import com.webshop.app.exception.NotFoundException;
import com.webshop.app.repository.OrderRepo;
import com.webshop.app.repository.PaymentRepo;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Servis koji povezuje narucenu porudzbinu (Order) sa Stripe Checkout Session-om.
 * Tok: korisnik naruci proizvode (OrderItemService.placeOrder) -> frontend poziva
 * /payment/create-checkout-session/{orderId} -> korisnik se prebacuje na Stripe
 * stranicu za placanje karticom (test mod) -> Stripe salje webhook kada se plati.
 *
 * Stripe ne podrzava RSD, pa se cene konvertuju u EUR (1 EUR ~ 117 RSD).
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class StripeService {

    private final OrderRepo orderRepo;
    private final PaymentRepo paymentRepo;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    // kurs RSD -> EUR za prikaz na Stripe stranici
    private static final BigDecimal RSD_TO_EUR_RATE = BigDecimal.valueOf(117);

    public String createCheckoutSession(Long orderId, User user) throws StripeException {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/payment-success?orderId=" + orderId)
                .setCancelUrl(frontendUrl + "/payment-cancelled?orderId=" + orderId)
                .setCustomerEmail(user.getEmail())
                .putMetadata("orderId", String.valueOf(orderId));

        for (OrderItem item : order.getOrderItemList()) {
            BigDecimal unitPrice = item.getProduct().getPrice();
            // konverzija RSD -> EUR -> EUR centi (Stripe koristi najmanju jedinicu valute)
            long unitAmountInCents = unitPrice
                    .divide(RSD_TO_EUR_RATE, 2, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .longValue();

            SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                    .setQuantity((long) item.getQuantity())
                    .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("eur")
                                    .setUnitAmount(unitAmountInCents)
                                    .setProductData(
                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                    .setName(item.getProduct().getName())
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();
            paramsBuilder.addLineItem(lineItem);
        }

        Session session = Session.create(paramsBuilder.build());

        Payment payment = paymentRepo.findByOrderId(orderId).orElse(new Payment());
        payment.setOrder(order);
        payment.setAmount(order.getTotalPrice());
        payment.setMethod("CARD");
        payment.setStatus("PENDING");
        payment.setStripeSessionId(session.getId());
        payment.setCustomerEmail(user.getEmail());
        paymentRepo.save(payment);

        return session.getUrl();
    }
}
