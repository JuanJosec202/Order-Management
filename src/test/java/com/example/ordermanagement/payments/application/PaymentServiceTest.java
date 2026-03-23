package com.example.ordermanagement.payments.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.example.ordermanagement.orders.domain.Order;
import com.example.ordermanagement.orders.domain.OrderItem;
import com.example.ordermanagement.orders.domain.OrderStatus;
import com.example.ordermanagement.payments.domain.Payment;
import com.example.ordermanagement.payments.domain.PaymentStatus;
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
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private OrderPaymentGateway orderPaymentGateway;

    @InjectMocks
    private PaymentService paymentService;

    @Test
    void shouldApprovePaymentAndMarkOrderAsPaid() {
        Order order = new Order(
                1L,
                List.of(OrderItem.create(10L, "Keyboard", new BigDecimal("50.00"), 2)),
                new BigDecimal("100.00"),
                OrderStatus.CREATED,
                null,
                null,
                null,
                null
        );

        when(orderPaymentGateway.findOrderById(1L)).thenReturn(Optional.of(order));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Payment payment = paymentService.processPayment(new ProcessPaymentCommand(1L, true, null));

        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.APPROVED);
        assertThat(order.getStatus()).isEqualTo(OrderStatus.PAID);
        verify(orderPaymentGateway).saveOrder(order);
        ArgumentCaptor<Payment> captor = ArgumentCaptor.forClass(Payment.class);
        verify(paymentRepository).save(captor.capture());
        assertThat(captor.getValue().getAmount()).isEqualByComparingTo("100.00");
    }

    @Test
    void shouldRejectPaymentWhenOrderIsNotInCreatedState() {
        Order order = new Order(
                1L,
                List.of(OrderItem.create(10L, "Keyboard", new BigDecimal("50.00"), 2)),
                new BigDecimal("100.00"),
                OrderStatus.PAID,
                null,
                null,
                null,
                null
        );

        when(orderPaymentGateway.findOrderById(1L)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> paymentService.processPayment(new ProcessPaymentCommand(1L, true, null)))
                .isInstanceOf(InvalidOrderPaymentStateException.class)
                .hasMessageContaining("1");

        verifyNoInteractions(paymentRepository);
    }
}
