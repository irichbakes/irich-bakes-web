import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { Category } from "@/lib/types/database";
import { unstable_cache, revalidateTag } from "next/cache";
import { cache } from "react";

export const getActiveCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data as Category[]) ?? [];
  },
  ["active-categories"],
  { revalidate: 3600, tags: ["categories"] }
);

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as Category[]) ?? [];
}

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  return unstable_cache(
    async (): Promise<Category | null> => {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) return null;
      return data as Category;
    },
    [`category-by-slug-${slug}`],
    { revalidate: 3600, tags: ["categories"] }
  )();
});

export async function createCategory(category: Partial<Category>): Promise<Category> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  revalidateTag("categories", {});
  return data as Category;
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<Category> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidateTag("categories", {});
  return data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  revalidateTag("categories", {});
}

