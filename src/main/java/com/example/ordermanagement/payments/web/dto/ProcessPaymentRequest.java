package com.example.ordermanagement.payments.web.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProcessPaymentRequest(@NotNull Long orderId,
                                    @NotNull Boolean approved,
                                    @Size(max = 255) String rejectionReason) {
}
