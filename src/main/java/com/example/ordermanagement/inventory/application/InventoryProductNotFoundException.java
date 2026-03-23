package com.example.ordermanagement.inventory.application;

import com.example.ordermanagement.shared.application.exception.ResourceNotFoundException;

public class InventoryProductNotFoundException extends ResourceNotFoundException {

    public InventoryProductNotFoundException(Long productId) {
        super("Product with id " + productId + " was not found");
    }
}
