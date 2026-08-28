import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/types/database";

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as Testimonial[]) ?? [];
}

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
  return data as Testimonial;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}
