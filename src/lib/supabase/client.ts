import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Order } from '../../types';

const env = import.meta.env as Record<string, string | undefined>;
const supabaseUrl = (env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseKey = (
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  ''
).trim();

const isValidHttpUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

export const isSupabaseConfigured =
  isValidHttpUrl(supabaseUrl) && supabaseKey.length > 0;

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createBrowserClient(supabaseUrl, supabaseKey)
  : null;

export async function saveOrderToSupabase(order: Order): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('markaz_orders').insert({
      order_code: order.id,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      city: order.city,
      address: order.address,
      payment_method: order.paymentMethod,
      status: order.status,
      subtotal: order.subtotal,
      delivery_fee: order.deliveryFee,
      total_payable: order.totalCustomerPayable,
      total_reseller_profit: order.totalResellerProfit,
      items: order.items,
    });
  } catch {
    // Keep local checkout resilient even before Supabase tables are provisioned
  }
}

export async function saveContactMessageToSupabase(
  email: string,
  message: string
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const cleanEmail = email.trim();
    const cleanMsg = message.trim();
    const derivedName = cleanEmail.split('@')[0] || 'Markaz Visitor';

    const { error: contactErr } = await supabase.from('contact_messages').insert({
      name: derivedName,
      email: cleanEmail,
      project_type: 'Markaz Contact',
      message: cleanMsg,
    });

    if (!contactErr) return true;

    const { error: markazMsgErr } = await supabase.from('markaz_messages').insert({
      email: cleanEmail,
      message: cleanMsg,
    });

    return !markazMsgErr;
  } catch {
    return false;
  }
}
