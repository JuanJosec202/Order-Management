package com.example.ordermanagement.orders.application;

import com.example.ordermanagement.shared.application.exception.ResourceNotFoundException;

public class OrderedProductNotFoundException extends ResourceNotFoundException {

    public OrderedProductNotFoundException(Long productId) {
        super("Product with id " + productId + " was not found");
    }
}
