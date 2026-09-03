"use client";

import { useEffect, useState } from "react";
import { Save, Store, PhoneCall, Share2, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cleanSettingValue } from "@/lib/utils/formatters";
import toast from "react-hot-toast";

interface SettingGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  fields: { key: string; label: string; type: "text" | "textarea" }[];
}

const settingGroups: SettingGroup[] = [
  {
    id: "general",
    title: "Store Information",
    icon: Store,
    fields: [
      { key: "site_name", label: "Site Name", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "announcement_text", label: "Announcement Bar Text", type: "text" },
    ],
  },
  {
    id: "contact",
    title: "Contact & Location",
    icon: PhoneCall,
    fields: [
      { key: "whatsapp_number", label: "WhatsApp Number (with country code)", type: "text" },
      { key: "phone", label: "Phone Number", type: "text" },
      { key: "email", label: "Email Address", type: "text" },
      { key: "address", label: "Bakery Address", type: "textarea" },
      { key: "working_hours", label: "Working Hours", type: "text" },
    ],
  },
  {
    id: "social",
    title: "Social Media Links",
    icon: Share2,
    fields: [
      { key: "social_instagram", label: "Instagram URL", type: "text" },
      { key: "social_facebook", label: "Facebook URL", type: "text" },
      { key: "social_youtube", label: "YouTube URL", type: "text" },
    ],
  },
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

      toast.success("Settings saved successfully! Refresh the site to see changes.");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-white rounded-2xl border border-[#EBE4DC] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2A1C15]">Site Settings</h1>
          <p className="text-xs text-[#7A6658] mt-0.5">
            Manage site titles, contact details, social profiles, and store configuration.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7C4D30] hover:bg-[#633B23] text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 transition-all cursor-pointer"
        >
          <Save size={16} />
          <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
        </button>
      </div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {settingGroups.map((group) => {
          const GroupIcon = group.icon;
          return (
            <div
              key={group.id}
              className="bg-white rounded-2xl p-6 border border-[#EBE4DC] shadow-2xs space-y-5"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-[#F0EAE3]">
                <div className="w-9 h-9 rounded-xl bg-[#FAF7F4] text-[#7C4D30] border border-[#E3DAD1] flex items-center justify-center">
                  <GroupIcon size={18} />
                </div>
                <h2 className="text-base font-bold text-[#2A1C15]">{group.title}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.fields.map((field) => (
                  <div
                    key={field.key}
                    className={field.type === "textarea" ? "sm:col-span-2" : ""}
                  >
                    <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={settings[field.key] ?? ""}
                        onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                        rows={3}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] outline-none focus:border-[#7C4D30] resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={settings[field.key] ?? ""}
                        onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] outline-none focus:border-[#7C4D30]"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

