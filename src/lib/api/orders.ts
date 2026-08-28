import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types/database";

export async function getAllOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Order[]) ?? [];
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (error) return null;
  return data as Order;
}

export async function createOrder(order: Partial<Order>): Promise<Order> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function getOrderStats(): Promise<{ total: number; pending: number; delivered: number }> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select("status");

  if (error) throw error;

  const orders = (data ?? []) as { status: string }[];
  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };
}
