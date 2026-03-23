package com.example.ordermanagement.orders.infrastructure.persistence.mapper;

import com.example.ordermanagement.orders.domain.Order;
import com.example.ordermanagement.orders.domain.OrderItem;
import com.example.ordermanagement.orders.infrastructure.persistence.entity.OrderEntity;
import com.example.ordermanagement.orders.infrastructure.persistence.entity.OrderItemEntity;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class OrderPersistenceMapper {

    public Order toDomain(OrderEntity entity) {
        List<OrderItem> items = entity.getItems().stream().map(this::toDomainItem).toList();
        return new Order(entity.getId(), items, entity.getTotalAmount(), entity.getStatus(), entity.getCreatedAt(), entity.getUpdatedAt(), entity.getCreatedBy(), entity.getUpdatedBy());
    }

    public OrderEntity toEntity(Order order) {
        OrderEntity entity = new OrderEntity();
        entity.setId(order.getId());
        entity.setTotalAmount(order.getTotalAmount());
        entity.setStatus(order.getStatus());
        entity.setCreatedAt(order.getCreatedAt());
        entity.setUpdatedAt(order.getUpdatedAt());
        entity.setCreatedBy(order.getCreatedBy());
        entity.setUpdatedBy(order.getUpdatedBy());
        entity.setItems(order.getItems().stream().map(orderItem -> toEntityItem(orderItem, entity)).toList());
        return entity;
    }

    private OrderItem toDomainItem(OrderItemEntity entity) {
        return new OrderItem(entity.getId(), entity.getProductId(), entity.getProductName(), entity.getUnitPrice(), entity.getQuantity(), entity.getLineTotal());
    }

    private OrderItemEntity toEntityItem(OrderItem orderItem, OrderEntity orderEntity) {
        OrderItemEntity entity = new OrderItemEntity();
        entity.setId(orderItem.getId());
        entity.setOrder(orderEntity);
        entity.setProductId(orderItem.getProductId());
        entity.setProductName(orderItem.getProductName());
        entity.setUnitPrice(orderItem.getUnitPrice());
        entity.setQuantity(orderItem.getQuantity());
        entity.setLineTotal(orderItem.getLineTotal());
        return entity;
    }
}
