package com.example.ordermanagement.products.application;

import com.example.ordermanagement.products.domain.Product;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional
    public Product createProduct(CreateProductCommand command) {
        String normalizedSku = normalizeSku(command.sku());
        if (productRepository.existsBySku(normalizedSku)) {
            throw new DuplicateProductSkuException(normalizedSku);
        }

        Product product = Product.newProduct(
                normalizedSku,
                command.name(),
                command.description(),
                command.price()
        );

        return productRepository.save(product);
    }

    public List<Product> listProducts() {
        return productRepository.findAll();
    }

    public Product getProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));
    }

    @Transactional
    public Product updateProduct(Long productId, UpdateProductCommand command) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        String normalizedSku = normalizeSku(command.sku());
        if (productRepository.existsBySkuAndIdNot(normalizedSku, productId)) {
            throw new DuplicateProductSkuException(normalizedSku);
        }

        product.updateDetails(
                normalizedSku,
                command.name(),
                command.description(),
                command.price()
        );

        return productRepository.save(product);
    }

    private String normalizeSku(String sku) {
        return sku == null ? null : sku.trim().toUpperCase();
    }
}
