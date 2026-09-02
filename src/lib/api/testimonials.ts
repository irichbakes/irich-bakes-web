import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { Testimonial } from "@/lib/types/database";
import { unstable_cache, revalidateTag } from "next/cache";

export const getActiveTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data as Testimonial[]) ?? [];
  },
  ["active-testimonials"],
  { revalidate: 3600, tags: ["testimonials"] }
);

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as Testimonial[]) ?? [];
}

export async function createTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .insert(testimonial)
    .select()
    .single();

  if (error) throw error;
  revalidateTag("testimonials", {});
  return data as Testimonial;
}

export async function updateTestimonial(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .update(testimonial)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidateTag("testimonials", {});
  return data as Testimonial;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
  revalidateTag("testimonials", {});
}

