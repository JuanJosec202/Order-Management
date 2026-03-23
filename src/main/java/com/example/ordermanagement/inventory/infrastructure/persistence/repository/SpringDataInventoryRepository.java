package com.example.ordermanagement.inventory.infrastructure.persistence.repository;

import com.example.ordermanagement.inventory.infrastructure.persistence.entity.InventoryItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataInventoryRepository extends JpaRepository<InventoryItemEntity, Long> {
}
