package com.example.ordermanagement.products.infrastructure.persistence.repository;

import com.example.ordermanagement.products.infrastructure.persistence.entity.ProductEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataProductRepository extends JpaRepository<ProductEntity, Long> {

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Long id);

    List<ProductEntity> findAllByOrderByIdAsc();

    Optional<ProductEntity> findById(Long id);
}
