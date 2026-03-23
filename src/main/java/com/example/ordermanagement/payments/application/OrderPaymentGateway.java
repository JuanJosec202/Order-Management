package com.example.ordermanagement.payments.application;

import com.example.ordermanagement.orders.domain.Order;
import java.util.Optional;

public interface OrderPaymentGateway {

    Optional<Order> findOrderById(Long orderId);

    Order saveOrder(Order order);
}
