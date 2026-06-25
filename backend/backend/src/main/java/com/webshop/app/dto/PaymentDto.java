package com.webshop.app.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO koji administratoru prikazuje detalje o izvrsenoj Stripe transakciji:
 * koji proizvod/i su kupljeni (kroz OrderDto -> orderItemList), po kojoj ceni,
 * u kojoj kolicini, i od strane kog kupca - tacno ono sto Zadatak IV trazi.
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDto {

    private Long id;
    private BigDecimal amount;
    private String method;
    private String status;
    private String stripeSessionId;
    private String stripePaymentIntentId;
    private String customerEmail;
    private LocalDateTime createdAt;
    private OrderDto order;
}
