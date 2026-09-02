-- =============================================
-- Migration 003: Add occasion_id to products table
-- Run this in Supabase SQL Editor
-- =============================================

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS occasion_id UUID REFERENCES occasions(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_occasion ON products(occasion_id);
