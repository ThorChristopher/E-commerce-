-- This script will seed your Neon database with initial data
-- Run this after setting up your database and running migrations

-- First, let's make sure we have some products
-- The application will automatically seed products if none exist

-- You can also manually insert products if needed:
-- INSERT INTO products (name, price, original_price, discount, category, image, images, rating, reviews, brand, description, specifications, in_stock, stock_count, featured)
-- VALUES 
-- ('Sample Product', 99.99, 129.99, 23, 'electronics', 'https://example.com/image.jpg', ARRAY['https://example.com/image1.jpg'], 4.5, 100, 'Sample Brand', 'A great product', ARRAY['Feature 1', 'Feature 2'], true, 50, true);

-- The application will handle seeding automatically when you first run it
SELECT 'Database ready for seeding' as status;
