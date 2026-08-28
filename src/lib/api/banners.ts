import { createClient } from "@/lib/supabase/server";
import type { Banner } from "@/lib/types/database";

export async function getActiveBanners(): Promise<Banner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as Banner[]) ?? [];
}

export async function getAllBanners(): Promise<Banner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as Banner[]) ?? [];
}

export async function createBanner(banner: Partial<Banner>): Promise<Banner> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("banners")
    .insert(banner)
    .select()
    .single();

  if (error) throw error;
  return data as Banner;
}

export async function updateBanner(id: string, banner: Partial<Banner>): Promise<Banner> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("banners")
    .update(banner)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Banner;
}

export async function deleteBanner(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw error;
}
