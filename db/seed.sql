-- db/seed.sql
INSERT IGNORE INTO customers (id, name, email, phone) VALUES (1, 'Wagner Corp', 'wagner@test.com', '555-0001');
INSERT IGNORE INTO products (name, sku, price_cents, stock) VALUES ('Laptop Developer', 'DEV-LAP-001', 150000, 10);