package com.example.ordermanagement.inventory.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.ordermanagement.inventory.domain.InventoryItem;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private ProductExistenceChecker productExistenceChecker;

    @InjectMocks
    private InventoryService inventoryService;

    @Test
    void shouldInitializeInventoryAndIncreaseStock() {
        when(productExistenceChecker.existsById(10L)).thenReturn(true);
        when(inventoryRepository.findByProductId(10L)).thenReturn(Optional.empty());
        when(inventoryRepository.save(any(InventoryItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        InventoryItem inventoryItem = inventoryService.increaseStock(10L, 5);

        assertThat(inventoryItem.getQuantity()).isEqualTo(5);
        ArgumentCaptor<InventoryItem> captor = ArgumentCaptor.forClass(InventoryItem.class);
        verify(inventoryRepository).save(captor.capture());
        assertThat(captor.getValue().getProductId()).isEqualTo(10L);
        assertThat(captor.getValue().getQuantity()).isEqualTo(5);
    }

    @Test
    void shouldPreventNegativeStock() {
        when(productExistenceChecker.existsById(10L)).thenReturn(true);
        when(inventoryRepository.findByProductId(10L)).thenReturn(Optional.of(new InventoryItem(10L, 2, null, null)));

        assertThatThrownBy(() -> inventoryService.decreaseStock(10L, 3))
                .isInstanceOf(InsufficientStockException.class)
                .hasMessageContaining("10");
    }
}
