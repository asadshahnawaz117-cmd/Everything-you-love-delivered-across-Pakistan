import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Order } from '../../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || '';

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
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
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
