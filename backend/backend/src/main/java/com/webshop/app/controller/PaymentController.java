package com.webshop.app.controller;

import com.webshop.app.dto.PaymentDto;
import com.webshop.app.dto.Response;
import com.webshop.app.entity.Order;
import com.webshop.app.entity.Payment;
import com.webshop.app.entity.User;
import com.webshop.app.enums.OrderStatus;
import com.webshop.app.exception.NotFoundException;
import com.webshop.app.mapper.EntityDtoMapper;
import com.webshop.app.repository.OrderRepo;
import com.webshop.app.repository.PaymentRepo;
import com.webshop.app.service.StripeService;
import com.webshop.app.service.interf.UserService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Pokriva ceo Stripe tok trazen u Zadatku IV:
 * 1) /payment/create-checkout-session/{orderId} - kupac pokrece placanje karticom
 * 2) /payment/webhook                            - Stripe obavestava nas server o uspesnoj uplati
 * 3) /payment/admin/all                          - administrator vidi sve izvrsene transakcije
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final StripeService stripeService;
    private final UserService userService;
    private final PaymentRepo paymentRepo;
    private final OrderRepo orderRepo;
    private final EntityDtoMapper entityDtoMapper;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @PostMapping("/payment/create-checkout-session/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Response> createCheckoutSession(@PathVariable Long orderId) {
        try {
            User user = userService.getLoginUser();
            String checkoutUrl = stripeService.createCheckoutSession(orderId, user);

            return ResponseEntity.ok(Response.builder()
                    .status(200)
                    .message(checkoutUrl)
                    .build());

        } catch (StripeException e) {
            log.error("Stripe error while creating checkout session", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Response.builder()
                    .status(500)
                    .message("Greška prilikom pokretanja Stripe plaćanja: " + e.getMessage())
                    .build());
        }
    }

   
    @PostMapping("/payment/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.error("Invalid Stripe webhook signature", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);

            if (session != null) {
                String sessionId = session.getId();
                String paymentIntentId = session.getPaymentIntent();

                Optional<Payment> paymentOpt = paymentRepo.findByStripeSessionId(sessionId);
                if (paymentOpt.isPresent()) {
                    Payment payment = paymentOpt.get();
                    payment.setStatus("PAID");
                    payment.setStripePaymentIntentId(paymentIntentId);
                    paymentRepo.save(payment);

                    Order order = payment.getOrder();
                    if (order != null) {
                        order.setStatus(OrderStatus.CONFIRMED);
                        orderRepo.save(order);
                    }

                    log.info("Payment {} marked as PAID for order {}", payment.getId(),
                            order != null ? order.getId() : "unknown");
                } else {
                    log.warn("Received Stripe webhook for unknown session id: {}", sessionId);
                }
            }
        }

        return ResponseEntity.ok("success");
    }

    @GetMapping("/payment/verify/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Response> verifyAndConfirmPayment(@PathVariable Long orderId) {
        try {
            Payment payment = paymentRepo.findByOrderId(orderId)
                    .orElseThrow(() -> new NotFoundException("Placanje nije pronadjeno za porudzbinu " + orderId));

            Session session = Session.retrieve(payment.getStripeSessionId());

            if ("paid".equals(session.getPaymentStatus())) {
                payment.setStatus("PAID");
                payment.setStripePaymentIntentId(session.getPaymentIntent());
                paymentRepo.save(payment);

                Order order = payment.getOrder();
                if (order != null && order.getStatus() != OrderStatus.CONFIRMED) {
                    order.setStatus(OrderStatus.CONFIRMED);
                    orderRepo.save(order);
                }
            }

            Order order = orderRepo.findById(orderId)
                    .orElseThrow(() -> new NotFoundException("Porudzbina nije pronadjena"));

            return ResponseEntity.ok(Response.builder()
                    .status(200)
                    .order(entityDtoMapper.mapOrderToDto(order))
                    .build());

        } catch (StripeException e) {
            log.error("Stripe error while verifying payment for order {}", orderId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Response.builder()
                    .status(500)
                    .message("Greška pri verifikaciji plaćanja: " + e.getMessage())
                    .build());
        }
    }

    /**
     * Administratoru prikazuje detalje svih transakcija: koji proizvod je kupljen,
     * po kojoj ceni, u kojoj kolicini, i od strane kog kupca - tacno kako Zadatak IV trazi.
     */
    @GetMapping("/payment/admin/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllPayments() {
        List<PaymentDto> payments = paymentRepo.findAll()
                .stream()
                .map(entityDtoMapper::mapPaymentToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Response.builder()
                .status(200)
                .paymentList(payments)
                .build());
    }
}
