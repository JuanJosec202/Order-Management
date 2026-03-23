CREATE TABLE inventory_items (
    product_id BIGINT PRIMARY KEY,
    quantity BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_inventory_items_product
        FOREIGN KEY (product_id) REFERENCES products (id)
);
