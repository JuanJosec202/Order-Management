package com.example.ordermanagement.orders.application;

import com.example.ordermanagement.shared.application.exception.BusinessConflictException;

public class OrderInsufficientStockException extends BusinessConflictException {

    public OrderInsufficientStockException(Long productId, long availableQuantity, int requestedQuantity) {
        super("Insufficient stock for product " + productId
                + ". Available: " + availableQuantity
                + ", requested: " + requestedQuantity);
    }
}
