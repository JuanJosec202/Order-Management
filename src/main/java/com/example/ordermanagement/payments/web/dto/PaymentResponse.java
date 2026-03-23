package com.example.ordermanagement.payments.web.dto;

import com.example.ordermanagement.payments.domain.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(Long id,
                              Long orderId,
                              BigDecimal amount,
                              PaymentStatus status,
                              String rejectionReason,
                              LocalDateTime createdAt) {
}
