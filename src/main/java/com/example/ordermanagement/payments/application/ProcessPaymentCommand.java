package com.example.ordermanagement.payments.application;

public record ProcessPaymentCommand(Long orderId,
                                    boolean approved,
                                    String rejectionReason) {
}
