"use server";

import { revalidateTag, revalidatePath } from "next/cache";

export async function revalidateBanners() {
  try {
    revalidateTag("banners", {});
  } catch {}
  try {
    revalidatePath("/");
    revalidatePath("/", "layout");
  } catch {}
}
