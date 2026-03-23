package com.example.ordermanagement.shared.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
@Tag(name = "Health", description = "Verificacion basica del estado de la API")
public class HealthController {

    @GetMapping
    @Operation(summary = "Health check", description = "Endpoint publico para verificar que la API esta disponible.")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
