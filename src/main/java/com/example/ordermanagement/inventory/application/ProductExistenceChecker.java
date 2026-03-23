package com.example.ordermanagement.inventory.application;

public interface ProductExistenceChecker {

    boolean existsById(Long productId);
}
