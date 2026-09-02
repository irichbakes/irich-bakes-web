import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { Product } from "@/lib/types/database";
import { unstable_cache, revalidateTag } from "next/cache";
import { cache } from "react";

export const getActiveProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data as Product[]) ?? [];
  },
  ["active-products"],
  { revalidate: 3600, tags: ["products"] }
);

export const getBestSellers = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_active", true)
      .eq("is_bestseller", true)
      .order("sort_order", { ascending: true })
      .limit(8);

    if (error) throw error;
    return (data as Product[]) ?? [];
  },
  ["bestsellers-products"],
  { revalidate: 3600, tags: ["products"] }
);

export const getProductsByCategory = cache(async (categoryId: string): Promise<Product[]> => {
  return unstable_cache(
    async (): Promise<Product[]> => {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("is_active", true)
        .eq("category_id", categoryId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return (data as Product[]) ?? [];
    },
    [`products-by-category-${categoryId}`],
    { revalidate: 3600, tags: ["products"] }
  )();
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  return unstable_cache(
    async (): Promise<Product | null> => {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("slug", slug)
        .single();

      if (error) return null;
      return data as Product;
    },
    [`product-by-slug-${slug}`],
    { revalidate: 3600, tags: ["products"] }
  )();
});

export const getRelatedProducts = cache(
  async (
    categoryId: string | null | undefined,
    excludeProductId: string,
    limit = 4
  ): Promise<Product[]> => {
    const supabase = createPublicClient();
    let related: Product[] = [];

    if (categoryId) {
      const { data } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("is_active", true)
        .eq("category_id", categoryId)
        .neq("id", excludeProductId)
        .order("sort_order", { ascending: true })
        .limit(limit);

      related = (data as Product[]) ?? [];
    }

    if (related.length < limit) {
      const excludeIds = [excludeProductId, ...related.map((p) => p.id)];
      const needed = limit - related.length;

      let query = supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("is_active", true)
        .order("is_bestseller", { ascending: false })
        .order("sort_order", { ascending: true })
        .limit(needed);

      if (excludeIds.length === 1) {
        query = query.neq("id", excludeIds[0]);
      } else if (excludeIds.length > 1) {
        query = query.not("id", "in", `(${excludeIds.join(",")})`);
      }

      const { data: fallback } = await query;
      if (fallback && fallback.length > 0) {
        related = [...related, ...(fallback as Product[])];
      }
    }

    return related;
  }
);

export async function searchProducts(query: string): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as Product[]) ?? [];
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as Product[]) ?? [];
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const supabase = await createClient();
  const { category, ...productData } = product;
  void category;
  const { data, error } = await supabase
    .from("products")
    .insert(productData)
    .select("*, category:categories(*)")
    .single();

  if (error) throw error;
  revalidateTag("products", {});
  return data as Product;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const supabase = await createClient();
  const { category, ...productData } = product;
  void category;
  const { data, error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id)
    .select("*, category:categories(*)")
    .single();

  if (error) throw error;
  revalidateTag("products", {});
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  revalidateTag("products", {});
}

