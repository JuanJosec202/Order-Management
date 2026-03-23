package com.example.ordermanagement.payments.application;

import com.example.ordermanagement.shared.application.exception.BusinessConflictException;

public class InvalidOrderPaymentStateException extends BusinessConflictException {

    public InvalidOrderPaymentStateException(Long orderId, String status) {
        super("Order " + orderId + " cannot be paid in status " + status);
    }
}
