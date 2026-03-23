package com.example.ordermanagement.products.web;

import com.example.ordermanagement.products.application.CreateProductCommand;
import com.example.ordermanagement.products.application.ProductService;
import com.example.ordermanagement.products.application.UpdateProductCommand;
import com.example.ordermanagement.products.web.dto.CreateProductRequest;
import com.example.ordermanagement.products.web.dto.ProductResponse;
import com.example.ordermanagement.products.web.dto.UpdateProductRequest;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/products")
@Tag(name = "Products", description = "Gestion de catalogo de productos")
@SecurityRequirement(name = "bearerAuth")
public class ProductController {

    private final ProductService productService;
    private final ProductWebMapper productWebMapper;

    public ProductController(ProductService productService, ProductWebMapper productWebMapper) {
        this.productService = productService;
        this.productWebMapper = productWebMapper;
    }

    @PostMapping
    @Operation(summary = "Crear producto", description = "Crea un producto en el catalogo.")
    @ApiResponse(responseCode = "201", description = "Producto creado")
    @ApiResponse(responseCode = "409", description = "SKU duplicado")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductResponse response = productWebMapper.toResponse(productService.createProduct(new CreateProductCommand(
                request.sku(),
                request.name(),
                request.description(),
                request.price()
        )));

        return ResponseEntity.created(URI.create("/api/products/" + response.id())).body(response);
    }

    @GetMapping
    @Operation(summary = "Listar productos", description = "Devuelve el catalogo completo de productos.")
    public List<ProductResponse> listProducts() {
        return productService.listProducts()
                .stream()
                .map(productWebMapper::toResponse)
                .toList();
    }

    @GetMapping("/{productId}")
    @Operation(summary = "Obtener producto por id")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    public ProductResponse getProduct(@PathVariable Long productId) {
        return productWebMapper.toResponse(productService.getProduct(productId));
    }

    @PutMapping("/{productId}")
    @Operation(summary = "Actualizar producto")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    @ApiResponse(responseCode = "409", description = "SKU duplicado")
    public ProductResponse updateProduct(@PathVariable Long productId,
                                         @Valid @RequestBody UpdateProductRequest request) {
        return productWebMapper.toResponse(productService.updateProduct(productId, new UpdateProductCommand(
                request.sku(),
                request.name(),
                request.description(),
                request.price()
        )));
    }
}
