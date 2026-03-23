package com.example.ordermanagement.payments.web;

import com.example.ordermanagement.payments.application.PaymentService;
import com.example.ordermanagement.payments.application.ProcessPaymentCommand;
import com.example.ordermanagement.payments.web.dto.PaymentResponse;
import com.example.ordermanagement.payments.web.dto.ProcessPaymentRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Payments", description = "Procesamiento simulado de pagos sobre ordenes")
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentWebMapper paymentWebMapper;

    public PaymentController(PaymentService paymentService, PaymentWebMapper paymentWebMapper) {
        this.paymentService = paymentService;
        this.paymentWebMapper = paymentWebMapper;
    }

    @PostMapping
    @Operation(summary = "Procesar pago", description = "Procesa un pago simulado para una orden en estado CREATED.")
    @ApiResponse(responseCode = "201", description = "Pago procesado")
    @ApiResponse(responseCode = "404", description = "Orden o pago no encontrado")
    @ApiResponse(responseCode = "409", description = "La orden no esta en un estado valido para pago")
    public ResponseEntity<PaymentResponse> processPayment(@Valid @RequestBody ProcessPaymentRequest request) {
        PaymentResponse response = paymentWebMapper.toResponse(paymentService.processPayment(new ProcessPaymentCommand(
                request.orderId(),
                request.approved(),
                request.rejectionReason()
        )));

        return ResponseEntity.created(URI.create("/api/payments/" + response.id())).body(response);
    }

    @GetMapping("/{paymentId}")
    @Operation(summary = "Consultar pago por id")
    @ApiResponse(responseCode = "404", description = "Pago no encontrado")
    public PaymentResponse getPayment(@PathVariable Long paymentId) {
        return paymentWebMapper.toResponse(paymentService.getPayment(paymentId));
    }

    @GetMapping
    @Operation(summary = "Listar pagos")
    public List<PaymentResponse> listPayments() {
        return paymentService.listPayments().stream().map(paymentWebMapper::toResponse).toList();
    }
}
