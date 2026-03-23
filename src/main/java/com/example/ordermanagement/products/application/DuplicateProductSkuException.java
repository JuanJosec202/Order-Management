package com.example.ordermanagement.products.application;

public class DuplicateProductSkuException extends RuntimeException {

    public DuplicateProductSkuException(String sku) {
        super("Product with sku '" + sku + "' already exists");
    }
}
