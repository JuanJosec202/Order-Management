package com.example.ordermanagement.orders.infrastructure.persistence;

import com.example.ordermanagement.orders.application.OrderRepository;
import com.example.ordermanagement.orders.domain.Order;
import com.example.ordermanagement.orders.infrastructure.persistence.mapper.OrderPersistenceMapper;
import com.example.ordermanagement.orders.infrastructure.persistence.repository.SpringDataOrderRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class JpaOrderRepository implements OrderRepository {

    private final SpringDataOrderRepository springDataOrderRepository;
    private final OrderPersistenceMapper mapper;

    public JpaOrderRepository(SpringDataOrderRepository springDataOrderRepository,
                              OrderPersistenceMapper mapper) {
        this.springDataOrderRepository = springDataOrderRepository;
        this.mapper = mapper;
    }

    @Override
    public Order save(Order order) {
        return mapper.toDomain(springDataOrderRepository.save(mapper.toEntity(order)));
    }

    @Override
    public Optional<Order> findById(Long orderId) {
        return springDataOrderRepository.findById(orderId).map(mapper::toDomain);
    }

    @Override
    public List<Order> findAll() {
        return springDataOrderRepository.findAllByOrderByIdAsc().stream().map(mapper::toDomain).toList();
    }
}
