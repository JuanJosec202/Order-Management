package com.example.ordermanagement.products.application;

import com.example.ordermanagement.shared.application.exception.ResourceNotFoundException;

public class ProductNotFoundException extends ResourceNotFoundException {

    public ProductNotFoundException(Long productId) {
        super("Product with id " + productId + " was not found");
    }
}
