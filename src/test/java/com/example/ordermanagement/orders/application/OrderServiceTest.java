package com.example.ordermanagement.orders.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.ordermanagement.orders.domain.Order;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductCatalog productCatalog;

    @Mock
    private InventoryGateway inventoryGateway;

    @InjectMocks
    private OrderService orderService;

    @Test
    void shouldCreateOrderCalculateTotalAndDecreaseStock() {
        CreateOrderCommand command = new CreateOrderCommand(List.of(
                new CreateOrderItemCommand(1L, 2),
                new CreateOrderItemCommand(2L, 1)
        ));

        when(productCatalog.findProductById(1L)).thenReturn(Optional.of(new OrderProductData(1L, "Keyboard", new BigDecimal("50.00"))));
        when(productCatalog.findProductById(2L)).thenReturn(Optional.of(new OrderProductData(2L, "Mouse", new BigDecimal("25.00"))));
        when(inventoryGateway.getAvailableStock(1L)).thenReturn(5L);
        when(inventoryGateway.getAvailableStock(2L)).thenReturn(3L);
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order order = orderService.createOrder(command);

        assertThat(order.getItems()).hasSize(2);
        assertThat(order.getTotalAmount()).isEqualByComparingTo("125.00");
        verify(inventoryGateway).decreaseStock(1L, 2);
        verify(inventoryGateway).decreaseStock(2L, 1);
        ArgumentCaptor<Order> captor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(captor.capture());
        assertThat(captor.getValue().getTotalAmount()).isEqualByComparingTo("125.00");
    }

    @Test
    void shouldRejectOrderWhenStockIsInsufficient() {
        CreateOrderCommand command = new CreateOrderCommand(List.of(new CreateOrderItemCommand(1L, 4)));
        when(productCatalog.findProductById(1L)).thenReturn(Optional.of(new OrderProductData(1L, "Keyboard", new BigDecimal("50.00"))));
        when(inventoryGateway.getAvailableStock(1L)).thenReturn(2L);

        assertThatThrownBy(() -> orderService.createOrder(command))
                .isInstanceOf(OrderInsufficientStockException.class)
                .hasMessageContaining("1");

        verify(orderRepository, times(0)).save(any(Order.class));
    }
}
