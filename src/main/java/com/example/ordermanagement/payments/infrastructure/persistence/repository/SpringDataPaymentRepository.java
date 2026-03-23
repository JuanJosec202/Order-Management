package com.example.ordermanagement.payments.infrastructure.persistence.repository;

import com.example.ordermanagement.payments.infrastructure.persistence.entity.PaymentEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataPaymentRepository extends JpaRepository<PaymentEntity, Long> {

    List<PaymentEntity> findAllByOrderByIdAsc();
}
