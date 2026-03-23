package com.example.ordermanagement.orders.infrastructure.catalog;

import com.example.ordermanagement.orders.application.OrderProductData;
import com.example.ordermanagement.orders.application.ProductCatalog;
import com.example.ordermanagement.products.application.ProductRepository;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class ProductRepositoryCatalogAdapter implements ProductCatalog {

    private final ProductRepository productRepository;

    public ProductRepositoryCatalogAdapter(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Optional<OrderProductData> findProductById(Long productId) {
        return productRepository.findById(productId)
                .map(product -> new OrderProductData(product.getId(), product.getName(), product.getPrice()));
    }
}
