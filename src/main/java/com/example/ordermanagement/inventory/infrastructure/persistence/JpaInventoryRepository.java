package com.example.ordermanagement.inventory.infrastructure.persistence;

import com.example.ordermanagement.inventory.application.InventoryRepository;
import com.example.ordermanagement.inventory.domain.InventoryItem;
import com.example.ordermanagement.inventory.infrastructure.persistence.mapper.InventoryPersistenceMapper;
import com.example.ordermanagement.inventory.infrastructure.persistence.repository.SpringDataInventoryRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class JpaInventoryRepository implements InventoryRepository {

    private final SpringDataInventoryRepository springDataInventoryRepository;
    private final InventoryPersistenceMapper mapper;

    public JpaInventoryRepository(SpringDataInventoryRepository springDataInventoryRepository,
                                  InventoryPersistenceMapper mapper) {
        this.springDataInventoryRepository = springDataInventoryRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<InventoryItem> findByProductId(Long productId) {
        return springDataInventoryRepository.findById(productId)
                .map(mapper::toDomain);
    }

    @Override
    public InventoryItem save(InventoryItem inventoryItem) {
        return mapper.toDomain(springDataInventoryRepository.save(mapper.toEntity(inventoryItem)));
    }
}
