import { createClient } from "@/lib/supabase/server";
import type { NewsletterSubscriber } from "@/lib/types/database";

export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as NewsletterSubscriber[]) ?? [];
}

export async function subscribeEmail(email: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email, is_active: true }, { onConflict: "email" });

  if (error) throw error;
}

export async function deleteSubscriber(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
