package com.example.ordermanagement.products.infrastructure.persistence.mapper;

import com.example.ordermanagement.products.domain.Product;
import com.example.ordermanagement.products.infrastructure.persistence.entity.ProductEntity;
import org.springframework.stereotype.Component;

@Component
public class ProductPersistenceMapper {

    public Product toDomain(ProductEntity entity) {
        return new Product(
                entity.getId(),
                entity.getSku(),
                entity.getName(),
                entity.getDescription(),
                entity.getPrice(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    public ProductEntity toEntity(Product product) {
        ProductEntity entity = new ProductEntity();
        entity.setId(product.getId());
        entity.setSku(product.getSku());
        entity.setName(product.getName());
        entity.setDescription(product.getDescription());
        entity.setPrice(product.getPrice());
        entity.setCreatedAt(product.getCreatedAt());
        entity.setUpdatedAt(product.getUpdatedAt());
        return entity;
    }
}
