package com.example.ordermanagement.orders.application;

import java.util.List;

public record CreateOrderCommand(List<CreateOrderItemCommand> items) {
}
