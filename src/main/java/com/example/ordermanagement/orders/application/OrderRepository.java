package com.example.ordermanagement.orders.application;

import com.example.ordermanagement.orders.domain.Order;
import java.util.List;
import java.util.Optional;

public interface OrderRepository {
    Order save(Order order);
    Optional<Order> findById(Long orderId);
    List<Order> findAll();
}
