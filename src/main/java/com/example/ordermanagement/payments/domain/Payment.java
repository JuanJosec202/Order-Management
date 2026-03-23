package com.example.ordermanagement.payments.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

public class Payment {

    private final Long id;
    private final Long orderId;
    private final BigDecimal amount;
    private final PaymentStatus status;
    private final String rejectionReason;
    private final LocalDateTime createdAt;

    public Payment(Long id,
                   Long orderId,
                   BigDecimal amount,
                   PaymentStatus status,
                   String rejectionReason,
                   LocalDateTime createdAt) {
        this.id = id;
        this.orderId = Objects.requireNonNull(orderId, "orderId must not be null");
        this.amount = Objects.requireNonNull(amount, "amount must not be null");
        this.status = Objects.requireNonNull(status, "status must not be null");
        this.rejectionReason = rejectionReason;
        this.createdAt = createdAt;
    }

    public static Payment approved(Long orderId, BigDecimal amount) {
        return new Payment(null, orderId, amount, PaymentStatus.APPROVED, null, null);
    }

    public static Payment rejected(Long orderId, BigDecimal amount, String rejectionReason) {
        return new Payment(null, orderId, amount, PaymentStatus.REJECTED, normalize(rejectionReason), null);
    }

    public Long getId() { return id; }
    public Long getOrderId() { return orderId; }
    public BigDecimal getAmount() { return amount; }
    public PaymentStatus getStatus() { return status; }
    public String getRejectionReason() { return rejectionReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    private static String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
