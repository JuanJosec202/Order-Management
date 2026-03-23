package com.example.ordermanagement.products.infrastructure.persistence;

import com.example.ordermanagement.products.application.ProductRepository;
import com.example.ordermanagement.products.domain.Product;
import com.example.ordermanagement.products.infrastructure.persistence.mapper.ProductPersistenceMapper;
import com.example.ordermanagement.products.infrastructure.persistence.repository.SpringDataProductRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class JpaProductRepository implements ProductRepository {

    private final SpringDataProductRepository springDataProductRepository;
    private final ProductPersistenceMapper mapper;

    public JpaProductRepository(SpringDataProductRepository springDataProductRepository,
                                ProductPersistenceMapper mapper) {
        this.springDataProductRepository = springDataProductRepository;
        this.mapper = mapper;
    }

    @Override
    public Product save(Product product) {
        return mapper.toDomain(springDataProductRepository.save(mapper.toEntity(product)));
    }

    @Override
    public List<Product> findAll() {
        return springDataProductRepository.findAllByOrderByIdAsc()
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Product> findById(Long id) {
        return springDataProductRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public boolean existsBySku(String sku) {
        return springDataProductRepository.existsBySku(sku);
    }

    @Override
    public boolean existsBySkuAndIdNot(String sku, Long id) {
        return springDataProductRepository.existsBySkuAndIdNot(sku, id);
    }
}
