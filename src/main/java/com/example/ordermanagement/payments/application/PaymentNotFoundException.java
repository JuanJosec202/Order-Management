package com.example.ordermanagement.payments.application;

import com.example.ordermanagement.shared.application.exception.ResourceNotFoundException;

public class PaymentNotFoundException extends ResourceNotFoundException {

    public PaymentNotFoundException(Long paymentId) {
        super("Payment with id " + paymentId + " was not found");
    }
}
