package com.example.ordermanagement.payments.infrastructure.persistence.mapper;

import com.example.ordermanagement.payments.domain.Payment;
import com.example.ordermanagement.payments.infrastructure.persistence.entity.PaymentEntity;
import org.springframework.stereotype.Component;

@Component
public class PaymentPersistenceMapper {

    public Payment toDomain(PaymentEntity entity) {
        return new Payment(
                entity.getId(),
                entity.getOrderId(),
                entity.getAmount(),
                entity.getStatus(),
                entity.getRejectionReason(),
                entity.getCreatedAt()
        );
    }

    public PaymentEntity toEntity(Payment payment) {
        PaymentEntity entity = new PaymentEntity();
        entity.setId(payment.getId());
        entity.setOrderId(payment.getOrderId());
        entity.setAmount(payment.getAmount());
        entity.setStatus(payment.getStatus());
        entity.setRejectionReason(payment.getRejectionReason());
        entity.setCreatedAt(payment.getCreatedAt());
        return entity;
    }
}
