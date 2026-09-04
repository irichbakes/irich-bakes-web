import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { Banner } from "@/lib/types/database";
import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";

export async function revalidateBanners(): Promise<void> {
  try {
    revalidateTag("banners", {});
  } catch {}
  try {
    revalidatePath("/");
    revalidatePath("/", "layout");
  } catch {}
}

export const getActiveBanners = unstable_cache(
  async (): Promise<Banner[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data as Banner[]) ?? [];
  },
  ["active-banners"],
  { revalidate: 3600, tags: ["banners"] }
);

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
  const { id: _, created_at: __, ...insertData } = banner;
  const { data, error } = await supabase
    .from("banners")
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;
  await revalidateBanners();
  return data as Banner;
}

export async function updateBanner(id: string, banner: Partial<Banner>): Promise<Banner> {
  const supabase = await createClient();
  const { id: _, created_at: __, ...updateData } = banner;
  const { data, error } = await supabase
    .from("banners")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  await revalidateBanners();
  return data as Banner;
}

export async function deleteBanner(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw error;
  await revalidateBanners();
}

