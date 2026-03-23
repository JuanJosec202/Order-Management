package com.example.ordermanagement.orders.infrastructure.persistence.repository;

import com.example.ordermanagement.orders.infrastructure.persistence.entity.OrderEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataOrderRepository extends JpaRepository<OrderEntity, Long> {

    List<OrderEntity> findAllByOrderByIdAsc();
}
