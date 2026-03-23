package com.example.ordermanagement.products.application;

import com.example.ordermanagement.products.domain.Product;
import java.util.List;
import java.util.Optional;

public interface ProductRepository {

    Product save(Product product);

    List<Product> findAll();

    Optional<Product> findById(Long id);

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Long id);
}
