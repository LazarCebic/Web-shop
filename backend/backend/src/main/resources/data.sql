-- =============================================
-- TEST PODACI ZA WEBSHOP APLIKACIJU
-- Lozinka admina:    admin123
-- Lozinka korisnika: korisnik123
-- =============================================

-- KATEGORIJE
INSERT INTO categories (id, name) VALUES
(1, 'Elektronika'),
(2, 'Odeca'),
(3, 'Knjige'),
(4, 'Sport i rekreacija'),
(5, 'Kucni aparati');

-- KORISNICI (1 admin + 9 korisnika)
INSERT INTO users (id, name, email, password, phone_number, role, created_at) VALUES
(1,  'Admin Adminovic',   'admin@webshop.com', '$2a$10$v5OyhzJ09czXb33HFcTWse/o2FGCp0/biR6QAxx9Ec4Nv6xg6G/EW', '0641000001', 'ADMIN', NOW()),
(2,  'Marko Markovic',    'marko@gmail.com',   '$2a$10$tEANyFPcvNXYr4N7328QMO6GFHTc7knGy5iv.6uGRDKG3WWkyrpS6', '0641000002', 'USER',  NOW()),
(3,  'Ana Anic',          'ana@gmail.com',     '$2a$10$tEANyFPcvNXYr4N7328QMO6GFHTc7knGy5iv.6uGRDKG3WWkyrpS6', '0641000003', 'USER',  NOW()),
(4,  'Nikola Nikolic',    'nikola@gmail.com',  '$2a$10$tEANyFPcvNXYr4N7328QMO6GFHTc7knGy5iv.6uGRDKG3WWkyrpS6', '0641000004', 'USER',  NOW()),
(5,  'Jelena Jelic',      'jelena@gmail.com',  '$2a$10$tEANyFPcvNXYr4N7328QMO6GFHTc7knGy5iv.6uGRDKG3WWkyrpS6', '0641000005', 'USER',  NOW()),
(6,  'Stefan Stefanovic', 'stefan@gmail.com',  '$2a$10$tEANyFPcvNXYr4N7328QMO6GFHTc7knGy5iv.6uGRDKG3WWkyrpS6', '0641000006', 'USER',  NOW()),
(7,  'Milica Milic',      'milica@gmail.com',  '$2a$10$tEANyFPcvNXYr4N7328QMO6GFHTc7knGy5iv.6uGRDKG3WWkyrpS6', '0641000007', 'USER',  NOW()),
(8,  'Petar Petrovic',    'petar@gmail.com',   '$2a$10$tEANyFPcvNXYr4N7328QMO6GFHTc7knGy5iv.6uGRDKG3WWkyrpS6', '0641000008', 'USER',  NOW()),
(9,  'Maja Majic',        'maja@gmail.com',    '$2a$10$tEANyFPcvNXYr4N7328QMO6GFHTc7knGy5iv.6uGRDKG3WWkyrpS6', '0641000009', 'USER',  NOW()),
(10, 'Ivan Ivanovic',     'ivan@gmail.com',    '$2a$10$tEANyFPcvNXYr4N7328QMO6GFHTc7knGy5iv.6uGRDKG3WWkyrpS6', '0641000010', 'USER',  NOW());

-- PROIZVODI
INSERT INTO products (id, name, description, image_url, price, stock_quantity, category_id, created_at) VALUES
(1,  'Samsung Galaxy S24',     'Flagship Android smartphone sa 6.1 ekranom i 50MP kamerom',         'https://placehold.co/400x400?text=Galaxy+S24',  129999.00, 15, 1, NOW()),
(2,  'Apple MacBook Air M3',   'Laptop sa M3 cipom, 8GB RAM, 256GB SSD, 13.6 Liquid Retina ekran', 'https://placehold.co/400x400?text=MacBook+Air', 189999.00,  8, 1, NOW()),
(3,  'Sony WH-1000XM5',       'Bezicne slusalice sa najboljim noise cancellingom na trzistu',       'https://placehold.co/400x400?text=Sony+WH',      49999.00, 20, 1, NOW()),
(4,  'Nike Air Force 1',      'Klasicna bela sportska obuca, dostupna u vise velicina',            'https://placehold.co/400x400?text=Nike+AF1',     18999.00, 30, 2, NOW()),
(5,  'Levis 501 Jeans',       'Original slim fit farmerke, 100% pamuk, unisex model',               'https://placehold.co/400x400?text=Levis+501',     9999.00, 25, 2, NOW()),
(6,  'Adidas Hoodie',         'Udobna dukserica s kapuljacom od flisa',                              'https://placehold.co/400x400?text=Adidas+Hood',   7499.00, 40, 2, NOW()),
(7,  'Cistoca i nered',       'Roman Harukija Murakamija, bestseler 2024. godine',                   'https://placehold.co/400x400?text=Murakami',        999.00, 50, 3, NOW()),
(8,  'Atomske navike',        'Bestseler Dzejmsa Klira o izgradnji dobrih navika',                   'https://placehold.co/400x400?text=Atomic',         1299.00, 45, 3, NOW()),
(9,  'Covek koji je gledao', 'Triler domaceg autora koji je osvojio nagradu za roman godine',     'https://placehold.co/400x400?text=Knjiga',          849.00, 60, 3, NOW()),
(10, 'Fitnes bicikl Kettler', 'Sobni bicikl s 8 nivoa otpora, LCD ekranom, nosivost do 120kg',      'https://placehold.co/400x400?text=Bicikl',        54999.00,  5, 4, NOW()),
(11, 'Yoga prostirka',        'Antiklizajuca prostirka 183x61cm, debljine 6mm, ekoloski materijal', 'https://placehold.co/400x400?text=Yoga+Mat',       2999.00, 35, 4, NOW()),
(12, 'Bucice set 20kg',       'Set bucica s gumiranom oblogom, 10 komada od 1kg do 10kg',           'https://placehold.co/400x400?text=Bucice',        14999.00, 10, 4, NOW()),
(13, 'Philips Airfryer XXL',  'Friteza na topli zrak, 7.3L kapacitet, 13 programa',                 'https://placehold.co/400x400?text=Airfryer',      24999.00, 12, 5, NOW()),
(14, 'Nespresso Vertuo Next', 'Aparat za kafu s centrifugalnom tehnologijom, 5 velicina soljice',   'https://placehold.co/400x400?text=Nespresso',     17999.00, 18, 5, NOW()),
(15, 'Dyson V15 Detect',      'Bezicni usisivac s laserskim otkrivanjem prasine, 60 min autonomije','https://placehold.co/400x400?text=Dyson+V15',     79999.00,  6, 5, NOW());

-- ADRESE
INSERT INTO addresses (id, street, city, state, zip_code, country, user_id, created_at) VALUES
(1,  'Knez Mihailova 10',     'Beograd',    'Srbija',              '11000', 'Srbija',              2, NOW()),
(2,  'Ilica 25',              'Zagreb',     'Hrvatska',            '10000', 'Hrvatska',            3, NOW()),
(3,  'Trg Slobode 5',         'Novi Sad',   'Vojvodina',           '21000', 'Srbija',              4, NOW()),
(4,  'Kralja Tomislava 3',    'Split',      'Dalmacija',           '21000', 'Hrvatska',            5, NOW()),
(5,  'Nemanjina 22',          'Beograd',    'Srbija',              '11000', 'Srbija',              6, NOW()),
(6,  'Zeleni Venac 8',        'Beograd',    'Srbija',              '11000', 'Srbija',              7, NOW()),
(7,  'Carigradska 15',        'Nis',        'Srbija',              '18000', 'Srbija',              8, NOW()),
(8,  'Marsala Tita 40',       'Sarajevo',   'Bosna i Hercegovina', '71000', 'Bosna i Hercegovina', 9, NOW()),
(9,  'Makedonska 7',          'Beograd',    'Srbija',              '11000', 'Srbija',             10, NOW()),
(10, 'Bulevar Oslobodjenja 1','Podgorica',  'Crna Gora',           '81000', 'Crna Gora',           1, NOW());

-- PORUDZBINE
INSERT INTO orders (id, total_price, status, user_id, created_at) VALUES
(1,  148998.00, 'DELIVERED',  2, NOW()),
(2,   27498.00, 'SHIPPED',    3, NOW()),
(3,   10998.00, 'CONFIRMED',  4, NOW()),
(4,  189999.00, 'CONFIRMED',  5, NOW()),
(5,   17498.00, 'PENDING',    6, NOW()),
(6,   79999.00, 'CANCELLED',  7, NOW()),
(7,    1698.00, 'DELIVERED',  8, NOW()),
(8,   54999.00, 'SHIPPED',    9, NOW()),
(9,   49999.00, 'CONFIRMED', 10, NOW()),
(10,  24999.00, 'PENDING',    2, NOW());

-- STAVKE PORUDZBINA
INSERT INTO order_items (id, quantity, price, product_id, order_id, created_at) VALUES
(1,  1, 129999.00,  1,  1, NOW()),
(2,  1,  18999.00,  4,  1, NOW()),
(3,  2,  14998.00,  5,  2, NOW()),
(4,  1,  12500.00,  6,  2, NOW()),
(5,  1,   9999.00,  5,  3, NOW()),
(6,  1,    999.00,  7,  3, NOW()),
(7,  1, 189999.00,  2,  4, NOW()),
(8,  1,   9999.00,  8,  5, NOW()),
(9,  1,   7499.00, 11,  5, NOW()),
(10, 1,  79999.00,  3,  6, NOW()),
(11, 1,    849.00,  9,  7, NOW()),
(12, 1,    849.00,  7,  7, NOW()),
(13, 1,  54999.00, 10,  8, NOW()),
(14, 1,  49999.00,  3,  9, NOW()),
(15, 1,  24999.00, 13, 10, NOW());

-- PLACANJA
INSERT INTO payments (id, amount, method, status, stripe_session_id, stripe_payment_intent_id, customer_email, order_id, created_at) VALUES
(1, 148998.00, 'CARD', 'PAID',    'cs_test_demo_001', 'pi_test_demo_001', 'marko@gmail.com',  1, NOW()),
(2,  27498.00, 'CARD', 'PAID',    'cs_test_demo_002', 'pi_test_demo_002', 'ana@gmail.com',    2, NOW()),
(3,  10998.00, 'CARD', 'PAID',    'cs_test_demo_003', 'pi_test_demo_003', 'nikola@gmail.com', 3, NOW()),
(4, 189999.00, 'CARD', 'PAID',    'cs_test_demo_004', 'pi_test_demo_004', 'jelena@gmail.com', 4, NOW()),
(5,  17498.00, 'CARD', 'PENDING', 'cs_test_demo_005', NULL,               'stefan@gmail.com', 5, NOW()),
(6,  79999.00, 'CARD', 'PENDING', 'cs_test_demo_006', NULL,               'milica@gmail.com', 6, NOW()),
(7,   1698.00, 'CARD', 'PAID',    'cs_test_demo_007', 'pi_test_demo_007', 'petar@gmail.com',  7, NOW()),
(8,  54999.00, 'CARD', 'PAID',    'cs_test_demo_008', 'pi_test_demo_008', 'maja@gmail.com',   8, NOW()),
(9,  49999.00, 'CARD', 'PAID',    'cs_test_demo_009', 'pi_test_demo_009', 'ivan@gmail.com',   9, NOW()),
(10, 24999.00, 'CARD', 'PENDING', 'cs_test_demo_010', NULL,               'marko@gmail.com', 10, NOW());

-- RECENZIJE
INSERT INTO reviews (id, content, rating, product_id, user_id, created_at) VALUES
(1,  'Odlican telefon, kamera je fenomenalna. Preporucujem svima!',         9,  1,  2, NOW()),
(2,  'MacBook je brz i tih, baterija traje citav dan. Zadovoljan sam.',    10,  2,  3, NOW()),
(3,  'Slusalice su vrhunske, noise cancelling radi savrseno u avionu.',     9,  3,  4, NOW()),
(4,  'Nike AF1 su udobne i izgledaju odlicno uz sve kombinacije.',          8,  4,  5, NOW()),
(5,  'Kvalitetne farmerke, dobro siju i materijal je odlican. Preporucujem!',   8,  5,  6, NOW());