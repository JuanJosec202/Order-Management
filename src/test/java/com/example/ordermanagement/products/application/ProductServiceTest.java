package com.example.ordermanagement.products.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.ordermanagement.products.domain.Product;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void shouldNormalizeSkuAndSaveProduct() {
        CreateProductCommand command = new CreateProductCommand(" sku-001 ", "Laptop", "Business laptop", new BigDecimal("1499.99"));
        when(productRepository.existsBySku("SKU-001")).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Product product = productService.createProduct(command);

        assertThat(product.getSku()).isEqualTo("SKU-001");
        ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(captor.capture());
        assertThat(captor.getValue().getSku()).isEqualTo("SKU-001");
    }

    @Test
    void shouldRejectDuplicateSkuOnCreate() {
        CreateProductCommand command = new CreateProductCommand("sku-001", "Laptop", "Business laptop", new BigDecimal("1499.99"));
        when(productRepository.existsBySku("SKU-001")).thenReturn(true);

        assertThatThrownBy(() -> productService.createProduct(command))
                .isInstanceOf(DuplicateProductSkuException.class)
                .hasMessageContaining("SKU-001");
    }
}
