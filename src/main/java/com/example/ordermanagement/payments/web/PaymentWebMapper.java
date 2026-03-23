package com.example.ordermanagement.payments.web;

import com.example.ordermanagement.payments.domain.Payment;
import com.example.ordermanagement.payments.web.dto.PaymentResponse;
import org.springframework.stereotype.Component;

@Component
public class PaymentWebMapper {

    public PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getOrderId(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getRejectionReason(),
                payment.getCreatedAt()
        );
    }
}
