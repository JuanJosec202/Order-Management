package com.example.ordermanagement.orders.application;

import java.util.Optional;

public interface ProductCatalog {
    Optional<OrderProductData> findProductById(Long productId);
}
