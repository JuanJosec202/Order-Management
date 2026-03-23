package com.example.ordermanagement.payments.infrastructure.persistence;

import com.example.ordermanagement.payments.application.PaymentRepository;
import com.example.ordermanagement.payments.domain.Payment;
import com.example.ordermanagement.payments.infrastructure.persistence.mapper.PaymentPersistenceMapper;
import com.example.ordermanagement.payments.infrastructure.persistence.repository.SpringDataPaymentRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class JpaPaymentRepository implements PaymentRepository {

    private final SpringDataPaymentRepository springDataPaymentRepository;
    private final PaymentPersistenceMapper mapper;

    public JpaPaymentRepository(SpringDataPaymentRepository springDataPaymentRepository,
                                PaymentPersistenceMapper mapper) {
        this.springDataPaymentRepository = springDataPaymentRepository;
        this.mapper = mapper;
    }

    @Override
    public Payment save(Payment payment) {
        return mapper.toDomain(springDataPaymentRepository.save(mapper.toEntity(payment)));
    }

    @Override
    public Optional<Payment> findById(Long paymentId) {
        return springDataPaymentRepository.findById(paymentId).map(mapper::toDomain);
    }

    @Override
    public List<Payment> findAll() {
        return springDataPaymentRepository.findAllByOrderByIdAsc().stream().map(mapper::toDomain).toList();
    }
}
