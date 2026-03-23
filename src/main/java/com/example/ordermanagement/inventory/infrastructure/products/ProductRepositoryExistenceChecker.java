package com.example.ordermanagement.inventory.infrastructure.products;

import com.example.ordermanagement.inventory.application.ProductExistenceChecker;
import com.example.ordermanagement.products.infrastructure.persistence.repository.SpringDataProductRepository;
import org.springframework.stereotype.Component;

@Component
public class ProductRepositoryExistenceChecker implements ProductExistenceChecker {

    private final SpringDataProductRepository springDataProductRepository;

    public ProductRepositoryExistenceChecker(SpringDataProductRepository springDataProductRepository) {
        this.springDataProductRepository = springDataProductRepository;
    }

    @Override
    public boolean existsById(Long productId) {
        return springDataProductRepository.existsById(productId);
    }
}
