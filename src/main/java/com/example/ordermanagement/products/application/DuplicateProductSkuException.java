package com.example.ordermanagement.products.application;

import com.example.ordermanagement.shared.application.exception.BusinessConflictException;

public class DuplicateProductSkuException extends BusinessConflictException {

    public DuplicateProductSkuException(String sku) {
        super("Product with sku '" + sku + "' already exists");
    }
}
