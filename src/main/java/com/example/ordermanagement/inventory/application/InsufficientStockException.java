package com.example.ordermanagement.inventory.application;

public class InsufficientStockException extends RuntimeException {

    public InsufficientStockException(Long productId, long availableQuantity, long requestedQuantity) {
        super("Insufficient stock for product " + productId
                + ". Available: " + availableQuantity
                + ", requested: " + requestedQuantity);
    }
}
