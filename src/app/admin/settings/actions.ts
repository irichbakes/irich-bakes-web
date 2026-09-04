"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { cleanSettingValue } from "@/lib/utils/formatters";

export async function revalidateSettings() {
  try {
    revalidateTag("settings", {});
  } catch {}
  try {
    revalidatePath("/");
    revalidatePath("/", "layout");
  } catch {}
}

export async function saveAllSettings(settingsMap: Record<string, string>): Promise<void> {
  const supabase = await createClient();
  const upserts = Object.entries(settingsMap).map(([key, value]) => ({
    key,
    value: typeof value === "string" ? cleanSettingValue(value) : value,
    updated_at: new Date().toISOString(),
  }));

  if (upserts.length > 0) {
    const { error } = await supabase
      .from("site_settings")
      .upsert(upserts, { onConflict: "key" });
    if (error) throw error;
  }

  await revalidateSettings();
}
