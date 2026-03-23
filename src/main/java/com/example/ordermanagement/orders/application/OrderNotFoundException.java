package com.example.ordermanagement.orders.application;

import com.example.ordermanagement.shared.application.exception.ResourceNotFoundException;

public class OrderNotFoundException extends ResourceNotFoundException {

    public OrderNotFoundException(Long orderId) {
        super("Order with id " + orderId + " was not found");
    }
}
