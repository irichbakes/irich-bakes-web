import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { getAllSettings } from "@/lib/api/settings";
import { getActiveCategories } from "@/lib/api/categories";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([
    getAllSettings(),
    getActiveCategories(),
  ]);

  return (
    <div className="min-h-full flex flex-col">
      <AnnouncementBar
        text={settings.announcement_text}
        whatsappNumber={settings.whatsapp_number}
      />
      <Navbar categories={categories} siteName={settings.site_name} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} categories={categories} />
      <CartDrawer whatsappNumber={settings.whatsapp_number} />
    </div>
  );
}
