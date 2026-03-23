package com.example.ordermanagement.inventory.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Locale;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class InventoryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "OPERATOR")
    void shouldIncreaseDecreaseAndQueryStock() throws Exception {
        long productId = createProduct("sku-stock-001", "Monitor 4K", "Inventory test product", 799.99);

        mockMvc.perform(post("/inventory/" + productId + "/increase")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "amount": 10
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productId").value(productId))
                .andExpect(jsonPath("$.quantity").value(10));

        mockMvc.perform(post("/inventory/" + productId + "/decrease")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "amount": 4
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(6));

        mockMvc.perform(get("/inventory/" + productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productId").value(productId))
                .andExpect(jsonPath("$.quantity").value(6));
    }

    @Test
    @WithMockUser(roles = "OPERATOR")
    void shouldRejectDecreaseWhenStockWouldBeNegative() throws Exception {
        long productId = createProduct("sku-stock-002", "Mechanical Keyboard", "Inventory failure case", 199.99);

        mockMvc.perform(post("/inventory/" + productId + "/decrease")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "amount": 1
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Insufficient stock for product " + productId + ". Available: 0, requested: 1"));
    }

    private long createProduct(String sku, String name, String description, double price) throws Exception {
        String payload = String.format(Locale.US, """
                {
                  "sku": "%s",
                  "name": "%s",
                  "description": "%s",
                  "price": %.2f
                }
                """, sku, name, description, price);

        MvcResult result = mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode jsonNode = objectMapper.readTree(result.getResponse().getContentAsString());
        return jsonNode.get("id").asLong();
    }
}
