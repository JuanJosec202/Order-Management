package com.example.ordermanagement.payments.application;

import com.example.ordermanagement.payments.domain.Payment;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository {

    Payment save(Payment payment);

    Optional<Payment> findById(Long paymentId);

    List<Payment> findAll();
}
