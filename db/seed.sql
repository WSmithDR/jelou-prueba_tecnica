-- =============================================
-- 1. CUSTOMERS (Clientes B2B)
-- =============================================
-- Usamos INSERT IGNORE para que si reinicias el seed no de error por duplicados

INSERT IGNORE INTO customers (id, name, email, phone) VALUES 
(1, 'Wagner Corp', 'wagner@test.com', '555-0001'),
(2, 'Tech Solutions Ltd', 'contact@techsolutions.com', '555-0102'),
(3, 'Global Industries', 'procurement@globalind.com', '555-0103'),
(4, 'Stark Industries', 'tony@stark.com', '555-9999'),
(5, 'Wayne Enterprises', 'bruce@wayne.com', '555-8888'),
(6, 'Cyberdyne Systems', 'skynet@cyberdyne.com', '555-0000'),
(7, 'Acme Corp', 'coyote@acme.com', '555-1111'),
(8, 'Umbrella Corporation', 'wesker@umbrella.com', '555-6666'),
(9, 'Massive Dynamic', 'bell@massivedynamic.com', '555-4444'),
(10, 'Hooli', 'belson@hooli.com', '555-3333'),
(11, 'Pied Piper', 'richard@piedpiper.com', '555-2222'),
(12, 'Soylent Corp', 'people@soylent.com', '555-7777'),
(13, 'Initech', 'lumbergh@initech.com', '555-5555'),
(14, 'Globex Corporation', 'scorpio@globex.com', '555-1234'),
(15, 'Aperture Science', 'glados@aperture.com', '555-CAKE');

-- =============================================
-- 2. PRODUCTS (Inventario Tecnológico)
-- =============================================
-- Precios en centavos (ej: 150000 = $1,500.00)

INSERT IGNORE INTO products (sku, name, price_cents, stock) VALUES 
('DEV-LAP-001', 'Laptop Developer Pro 16"', 250000, 15),
('DEV-LAP-002', 'Laptop Developer Air 13"', 180000, 25),
('MON-4K-001', 'Monitor UltraSharp 4K 27"', 65000, 50),
('MON-FHD-002', 'Monitor Standard FHD 24"', 25000, 100),
('PER-KEY-001', 'Teclado Mecánico RGB', 12000, 75),
('PER-MOU-001', 'Mouse Ergonómico Wireless', 8500, 80),
('PER-CAM-001', 'Webcam HD Pro 1080p', 15000, 40),
('PER-HEA-001', 'Headset Noise Cancelling', 35000, 30),
('FUR-CHR-001', 'Silla Ergonómica Herman', 120000, 10),
('FUR-DSK-001', 'Escritorio Elevable Motorizado', 85000, 12),
('ACC-DOCK-001', 'Docking Station USB-C', 22000, 60),
('ACC-STD-001', 'Soporte Laptop Aluminio', 4500, 150),
('NET-RTR-001', 'Router Wi-Fi 6 Mesh', 45000, 20),
('NET-SWT-001', 'Switch Gigabit 24 Puertos', 30000, 25),
('CAB-HDMI-001', 'Cable HDMI 2.1 Premium', 2500, 500);