package com.example.ordermanagement.payments.web;

import com.example.ordermanagement.payments.application.PaymentService;
import com.example.ordermanagement.payments.application.ProcessPaymentCommand;
import com.example.ordermanagement.payments.web.dto.PaymentResponse;
import com.example.ordermanagement.payments.web.dto.ProcessPaymentRequest;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentWebMapper paymentWebMapper;

    public PaymentController(PaymentService paymentService, PaymentWebMapper paymentWebMapper) {
        this.paymentService = paymentService;
        this.paymentWebMapper = paymentWebMapper;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> processPayment(@Valid @RequestBody ProcessPaymentRequest request) {
        PaymentResponse response = paymentWebMapper.toResponse(paymentService.processPayment(new ProcessPaymentCommand(
                request.orderId(),
                request.approved(),
                request.rejectionReason()
        )));

        return ResponseEntity.created(URI.create("/api/payments/" + response.id())).body(response);
    }

    @GetMapping("/{paymentId}")
    public PaymentResponse getPayment(@PathVariable Long paymentId) {
        return paymentWebMapper.toResponse(paymentService.getPayment(paymentId));
    }

    @GetMapping
    public List<PaymentResponse> listPayments() {
        return paymentService.listPayments().stream().map(paymentWebMapper::toResponse).toList();
    }
}
