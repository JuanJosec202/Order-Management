package com.example.ordermanagement.inventory.application;

import com.example.ordermanagement.shared.application.exception.BusinessConflictException;

public class InsufficientStockException extends BusinessConflictException {

    public InsufficientStockException(Long productId, long availableQuantity, long requestedQuantity) {
        super("Insufficient stock for product " + productId
                + ". Available: " + availableQuantity
                + ", requested: " + requestedQuantity);
    }
}
