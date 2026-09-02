import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { Occasion } from "@/lib/types/database";
import { unstable_cache, revalidateTag } from "next/cache";

export const getActiveOccasions = unstable_cache(
  async (): Promise<Occasion[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("occasions")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data as Occasion[]) ?? [];
  },
  ["active-occasions"],
  { revalidate: 3600, tags: ["occasions"] }
);

export async function getAllOccasions(): Promise<Occasion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("occasions")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as Occasion[]) ?? [];
}

export async function createOccasion(occasion: Partial<Occasion>): Promise<Occasion> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("occasions")
    .insert(occasion)
    .select()
    .single();

  if (error) throw error;
  revalidateTag("occasions", {});
  return data as Occasion;
}

export async function updateOccasion(id: string, occasion: Partial<Occasion>): Promise<Occasion> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("occasions")
    .update(occasion)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidateTag("occasions", {});
  return data as Occasion;
}

export async function deleteOccasion(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("occasions").delete().eq("id", id);
  if (error) throw error;
  revalidateTag("occasions", {});
}

