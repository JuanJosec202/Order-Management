package com.example.ordermanagement.payments.infrastructure;

import com.example.ordermanagement.orders.application.OrderRepository;
import com.example.ordermanagement.orders.domain.Order;
import com.example.ordermanagement.payments.application.OrderPaymentGateway;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class OrderPaymentGatewayAdapter implements OrderPaymentGateway {

    private final OrderRepository orderRepository;

    public OrderPaymentGatewayAdapter(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public Optional<Order> findOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    @Override
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }
}
