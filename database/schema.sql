-- MOH by Amiksha — PostgreSQL Database Schema
-- Run this file to initialize the database

CREATE DATABASE moh_amiksha;
\c moh_amiksha;

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('new_arrivals', 'collections')),
    collection_name VARCHAR(80) NOT NULL,
    description TEXT,
    sizes TEXT[] DEFAULT '{}',        -- e.g. ARRAY['XS','S','M','L','XL']
    customizable BOOLEAN DEFAULT FALSE,
    in_stock BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom orders table
CREATE TABLE custom_orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(120) NOT NULL,
    piece_name VARCHAR(120) NOT NULL,
    size VARCHAR(40) NOT NULL,
    color_preference VARCHAR(120),
    fabric_preference VARCHAR(80),
    notes TEXT,
    phone VARCHAR(20),
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','in_progress','dispatched','completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enquiries table
CREATE TABLE enquiries (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    message TEXT,
    responded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collections metadata table (optional enrichment)
CREATE TABLE collections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80) UNIQUE NOT NULL,
    tagline TEXT,
    banner_image_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- SEED DATA
-- =============================================

INSERT INTO collections (name, tagline) VALUES
    ('Bloom', 'Soft femininity in every petal — pastel florals celebrating womanhood.'),
    ('Petal', 'Lightweight fabrics with hand-blocked prints for the free spirit.'),
    ('Rose Garden', 'Rich embroidery and timeless silhouettes for special occasions.');

INSERT INTO products (name, price, category, collection_name, description, sizes, customizable) VALUES
    ('Rania Set',     4200,  'new_arrivals', 'Bloom',       'Delicate hand-embroidered coord set in powder pink',         ARRAY['XS','S','M','L','XL'],        TRUE),
    ('Aisha Anarkali',6800,  'new_arrivals', 'Bloom',       'Floor-length floral anarkali with mirror work',              ARRAY['S','M','L','XL'],             TRUE),
    ('Noor Lehenga',  12500, 'collections',  'Bloom',       'Bridal lehenga with intricate gota patti work',              ARRAY['XS','S','M','L'],             TRUE),
    ('Zara Crop Top', 1800,  'new_arrivals', 'Petal',       'Pastel crop top with floral hand prints',                    ARRAY['XS','S','M','L','XL','XXL'],  FALSE),
    ('Meera Kurta',   3200,  'collections',  'Petal',       'Elegant straight cut kurta in ivory',                       ARRAY['S','M','L','XL','XXL'],       TRUE),
    ('Sana Co-ord',   5400,  'collections',  'Petal',       'Matching set with floral block prints',                      ARRAY['XS','S','M','L','XL'],        TRUE),
    ('Layla Sharara', 7200,  'collections',  'Rose Garden', 'Classic sharara set with rose embroidery',                  ARRAY['S','M','L','XL'],             TRUE),
    ('Diya Maxi',     4500,  'new_arrivals', 'Rose Garden', 'Breezy maxi dress with floral motifs',                       ARRAY['XS','S','M','L','XL'],        FALSE),
    ('Aria Dupatta Set',8900,'collections',  'Rose Garden', 'Three-piece set with hand-painted dupatta',                  ARRAY['S','M','L','XL'],             TRUE);


-- Indexes for performance
CREATE INDEX idx_products_category     ON products(category);
CREATE INDEX idx_products_collection   ON products(collection_name);
CREATE INDEX idx_products_in_stock     ON products(in_stock);
CREATE INDEX idx_custom_orders_status  ON custom_orders(status);
CREATE INDEX idx_enquiries_responded   ON enquiries(responded);
