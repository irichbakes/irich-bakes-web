-- =============================================
-- Migration: Add mobile_image_url to banners table
-- Run this in Supabase SQL Editor
-- =============================================

ALTER TABLE banners ADD COLUMN IF NOT EXISTS mobile_image_url TEXT DEFAULT '';
