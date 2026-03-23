package com.example.ordermanagement.inventory.application;

public class InventoryProductNotFoundException extends RuntimeException {

    public InventoryProductNotFoundException(Long productId) {
        super("Product with id " + productId + " was not found");
    }
}
