"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cleanSettingValue } from "@/lib/utils/formatters";
import toast from "react-hot-toast";

interface SettingField {
  key: string;
  label: string;
  type: "text" | "textarea";
}

const settingFields: SettingField[] = [
  { key: "site_name", label: "Site Name", type: "text" },
  { key: "tagline", label: "Tagline", type: "text" },
  { key: "announcement_text", label: "Announcement Bar Text", type: "text" },
  { key: "whatsapp_number", label: "WhatsApp Number", type: "text" },
  { key: "phone", label: "Phone Number", type: "text" },
  { key: "email", label: "Email", type: "text" },
  { key: "address", label: "Address", type: "text" },
  { key: "working_hours", label: "Working Hours", type: "text" },
  { key: "social_instagram", label: "Instagram URL", type: "text" },
  { key: "social_facebook", label: "Facebook URL", type: "text" },
  { key: "social_youtube", label: "YouTube URL", type: "text" },
  { key: "currency_symbol", label: "Currency Symbol", type: "text" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      const map: Record<string, string> = {};
      (data ?? []).forEach((s: { key: string; value: unknown }) => {
        map[s.key] = cleanSettingValue(s.value);
      });
      setSettings(map);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const upserts = Object.entries(settings).map(([key, value]) => ({
        key,
        value: cleanSettingValue(value),
        updated_at: new Date().toISOString(),
      }));

      for (const upsert of upserts) {
        const { error } = await supabase
          .from("site_settings")
          .upsert(upsert, { onConflict: "key" });
        if (error) throw error;
      }

      toast.success("Settings saved! Refresh the site to see changes.");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-xl" />)}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#3C2415] text-white text-sm font-medium rounded-lg hover:bg-[#2A1A0E] disabled:opacity-50 transition-colors"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="space-y-5">
          {settingFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  value={settings[field.key] ?? ""}
                  onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47] resize-none transition"
                />
              ) : (
                <input
                  type="text"
                  value={settings[field.key] ?? ""}
                  onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47] transition"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
