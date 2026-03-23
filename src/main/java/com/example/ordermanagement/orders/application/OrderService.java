package com.example.ordermanagement.orders.application;

import com.example.ordermanagement.orders.domain.Order;
import com.example.ordermanagement.orders.domain.OrderItem;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductCatalog productCatalog;
    private final InventoryGateway inventoryGateway;

    public OrderService(OrderRepository orderRepository,
                        ProductCatalog productCatalog,
                        InventoryGateway inventoryGateway) {
        this.orderRepository = orderRepository;
        this.productCatalog = productCatalog;
        this.inventoryGateway = inventoryGateway;
    }

    @Transactional
    public Order createOrder(CreateOrderCommand command) {
        if (command.items() == null || command.items().isEmpty()) {
            throw new IllegalArgumentException("order must contain at least one item");
        }

        List<OrderItem> items = new ArrayList<>();
        for (CreateOrderItemCommand itemCommand : command.items()) {
            if (itemCommand.quantity() <= 0) {
                throw new IllegalArgumentException("quantity must be greater than zero");
            }

            OrderProductData product = productCatalog.findProductById(itemCommand.productId())
                    .orElseThrow(() -> new OrderedProductNotFoundException(itemCommand.productId()));

            long availableStock = inventoryGateway.getAvailableStock(itemCommand.productId());
            if (availableStock < itemCommand.quantity()) {
                throw new OrderInsufficientStockException(itemCommand.productId(), availableStock, itemCommand.quantity());
            }

            items.add(OrderItem.create(
                    product.id(),
                    product.name(),
                    product.price(),
                    itemCommand.quantity()
            ));
        }

        for (CreateOrderItemCommand itemCommand : command.items()) {
            inventoryGateway.decreaseStock(itemCommand.productId(), itemCommand.quantity());
        }

        return orderRepository.save(Order.create(items));
    }

    public Order getOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
    }

    public List<Order> listOrders() {
        return orderRepository.findAll();
    }
}
