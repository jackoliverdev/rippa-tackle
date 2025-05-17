-- Create products schema
CREATE SCHEMA IF NOT EXISTS products;

-- Create ENUM types for product categories and tags
CREATE TYPE products.product_category AS ENUM (
  'tackle',
  'bait',
  'rigs',
  'accessories', 
  'clothing',
  'bundles',
  'mystery-boxes'
);

CREATE TYPE products.product_tag AS ENUM (
  'best-seller',
  'new',
  'sale',
  'featured',
  'limited',
  'exclusive'
);

-- Create tables

-- Product images table
CREATE TABLE products.images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  alt TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product table
CREATE TABLE products.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  category products.product_category NOT NULL,
  subcategory TEXT,
  tags products.product_tag[] DEFAULT '{}',
  brand TEXT,
  inventory INTEGER NOT NULL DEFAULT 0,
  weight DECIMAL(10, 2),
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Additional fields as JSON
  dimensions JSONB DEFAULT NULL,
  specifications JSONB DEFAULT NULL,
  related_products UUID[] DEFAULT '{}'
);

-- Create a table for product images relationship
CREATE TABLE products.product_images (
  product_id UUID REFERENCES products.products(id) ON DELETE CASCADE,
  image_id UUID REFERENCES products.images(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  PRIMARY KEY (product_id, image_id)
);

-- Product variants table
CREATE TABLE products.variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  inventory INTEGER NOT NULL DEFAULT 0,
  weight DECIMAL(10, 2),
  size TEXT,
  color TEXT,
  options JSONB DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products.products(category);
CREATE INDEX idx_products_brand ON products.products(brand);
CREATE INDEX idx_products_created_at ON products.products(created_at);
CREATE INDEX idx_products_is_active ON products.products(is_active);
CREATE INDEX idx_variants_product_id ON products.variants(product_id);

-- Enable full-text search on product name and description
ALTER TABLE products.products ADD COLUMN ts_name tsvector
  GENERATED ALWAYS AS (to_tsvector('english', name)) STORED;
  
ALTER TABLE products.products ADD COLUMN ts_description tsvector
  GENERATED ALWAYS AS (to_tsvector('english', description)) STORED;

CREATE INDEX idx_products_ts_name ON products.products USING GIN (ts_name);
CREATE INDEX idx_products_ts_description ON products.products USING GIN (ts_description);

-- Create or replace functions for automatic updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products.products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_variants_updated_at
BEFORE UPDATE ON products.variants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_images_updated_at
BEFORE UPDATE ON products.images
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Policies
ALTER TABLE products.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE products.variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE products.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE products.product_images ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin role)
CREATE POLICY "Admins can do anything with products"
  ON products.products
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admins can do anything with variants"
  ON products.variants
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admins can do anything with images"
  ON products.images
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admins can do anything with product_images"
  ON products.product_images
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Create policies for public read access
CREATE POLICY "Products are viewable by everyone"
  ON products.products
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Variants are viewable by everyone"
  ON products.variants
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Images are viewable by everyone"
  ON products.images
  FOR SELECT
  USING (true);

CREATE POLICY "Product_images are viewable by everyone"
  ON products.product_images
  FOR SELECT
  USING (true);

-- Function to get product with images
CREATE OR REPLACE FUNCTION products.get_product_with_images(product_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  product_data JSONB;
  images_data JSONB;
BEGIN
  -- Get the product
  SELECT jsonb_build_object(
    'id', p.id,
    'name', p.name,
    'slug', p.slug,
    'sku', p.sku,
    'description', p.description,
    'shortDescription', p.short_description,
    'price', p.price,
    'compareAtPrice', p.compare_at_price,
    'category', p.category,
    'subcategory', p.subcategory,
    'tags', p.tags,
    'brand', p.brand,
    'inventory', p.inventory,
    'weight', p.weight,
    'dimensions', p.dimensions,
    'features', p.features,
    'specifications', p.specifications,
    'isActive', p.is_active,
    'createdAt', p.created_at,
    'updatedAt', p.updated_at
  )
  FROM products.products p
  WHERE p.slug = product_slug AND p.is_active = true
  INTO product_data;

  -- Get the images
  SELECT jsonb_agg(jsonb_build_object(
    'id', i.id,
    'url', i.url,
    'alt', i.alt,
    'isPrimary', i.is_primary
  ))
  FROM products.images i
  JOIN products.product_images pi ON i.id = pi.image_id
  WHERE pi.product_id = (product_data->>'id')::UUID
  ORDER BY pi.display_order
  INTO images_data;

  -- Add images to product data
  IF images_data IS NOT NULL THEN
    product_data = product_data || jsonb_build_object('images', images_data);
  ELSE
    product_data = product_data || jsonb_build_object('images', '[]'::jsonb);
  END IF;

  RETURN product_data;
END;
$$; 