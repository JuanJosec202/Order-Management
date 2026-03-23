package com.example.ordermanagement.payments.application;

import com.example.ordermanagement.orders.application.OrderNotFoundException;
import com.example.ordermanagement.orders.domain.Order;
import com.example.ordermanagement.orders.domain.OrderStatus;
import com.example.ordermanagement.payments.domain.Payment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderPaymentGateway orderPaymentGateway;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderPaymentGateway orderPaymentGateway) {
        this.paymentRepository = paymentRepository;
        this.orderPaymentGateway = orderPaymentGateway;
    }

    @Transactional
    public Payment processPayment(ProcessPaymentCommand command) {
        Order order = orderPaymentGateway.findOrderById(command.orderId())
                .orElseThrow(() -> new OrderNotFoundException(command.orderId()));

        if (order.getStatus() != OrderStatus.CREATED) {
            throw new InvalidOrderPaymentStateException(order.getId(), order.getStatus().name());
        }

        Payment payment;
        if (command.approved()) {
            order.markAsPaid();
            orderPaymentGateway.saveOrder(order);
            payment = Payment.approved(order.getId(), order.getTotalAmount());
        } else {
            payment = Payment.rejected(order.getId(), order.getTotalAmount(), command.rejectionReason());
        }

        return paymentRepository.save(payment);
    }

    public Payment getPayment(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));
    }

    public java.util.List<Payment> listPayments() {
        return paymentRepository.findAll();
    }
}
