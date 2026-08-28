import { createClient } from "@/lib/supabase/server";
import type { SiteSetting, SiteSettings } from "@/lib/types/database";
import { SITE_DEFAULTS } from "@/lib/utils/constants";

export async function getAllSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value");

  const settings: Record<string, string> = {};
  (data as SiteSetting[] | null)?.forEach((s) => {
    settings[s.key] = typeof s.value === "string" ? s.value : JSON.stringify(s.value);
  });

  return {
    site_name: settings.site_name || SITE_DEFAULTS.name,
    tagline: settings.tagline || SITE_DEFAULTS.tagline,
    whatsapp_number: settings.whatsapp_number || SITE_DEFAULTS.whatsapp,
    phone: settings.phone || "",
    email: settings.email || "",
    address: settings.address || "",
    working_hours: settings.working_hours || "",
    announcement_text: settings.announcement_text || SITE_DEFAULTS.announcement,
    social_instagram: settings.social_instagram || "",
    social_facebook: settings.social_facebook || "",
    social_youtube: settings.social_youtube || "",
    currency_symbol: settings.currency_symbol || SITE_DEFAULTS.currency,
    ...settings,
  };
}

export async function getSetting(key: string): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();

  return data?.value as string ?? "";
}

export async function updateSetting(key: string, value: string | number | boolean): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) throw error;
}
