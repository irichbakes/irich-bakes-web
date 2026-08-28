import { Croissant, LeafyGreen, Package, Truck } from "lucide-react";

const features = [
  {
    icon: Croissant,
    title: "Freshly Baked",
    description: "Made fresh for every order",
  },
  {
    icon: LeafyGreen,
    title: "Quality Ingredients",
    description: "No preservatives, ever",
  },
  {
    icon: Package,
    title: "Secure Packaging",
    description: "Packed with care & delivered safe",
  },
  {
    icon: Truck,
    title: "Kerala Delivery",
    description: "Delivering across selected locations",
  },
];

export default function FeatureStrip() {
  return (
    <section className="py-8 md:py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5F0EB] flex items-center justify-center flex-shrink-0">
                <feature.icon size={22} className="text-[#8B6F47]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#3C2415]">{feature.title}</h3>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
