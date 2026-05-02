'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  clampDiscountForMinTotal,
  computeSystemDiscountAmount,
  findSystemDiscountCode,
} from './discounts';

export type CartLine = {
  product_id: string;
  variant_id: string;
  slug: string;
  name: string;
  variant_label: string;
  price_paise: number;
  image: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  discountCode: string | null;
  addLine: (line: Omit<CartLine, 'quantity'>, qty?: number) => void;
  removeLine: (variant_id: string) => void;
  setQuantity: (variant_id: string, quantity: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  applyCode: (code: string) => { ok: true } | { ok: false; error: string };
  removeCode: () => void;
  totalPaise: () => number;
  totalItems: () => number;
  discountPaise: () => number;
  finalTotalPaise: (shippingPaise?: number) => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      discountCode: null,
      addLine: (line, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.variant_id === line.variant_id);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.variant_id === line.variant_id ? { ...l, quantity: l.quantity + qty } : l
              ),
              isOpen: true
            };
          }
          return { lines: [...s.lines, { ...line, quantity: qty }], isOpen: true };
        }),
      removeLine: (variant_id) =>
        set((s) => ({ lines: s.lines.filter((l) => l.variant_id !== variant_id) })),
      setQuantity: (variant_id, quantity) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.variant_id === variant_id ? { ...l, quantity } : l))
            .filter((l) => l.quantity > 0)
        })),
      clear: () => set({ lines: [], discountCode: null }),
      setOpen: (open) => set({ isOpen: open }),
      applyCode: (code) => {
        const found = findSystemDiscountCode(code);
        if (!found) return { ok: false, error: 'Invalid code.' };
        set({ discountCode: found.code });
        return { ok: true };
      },
      removeCode: () => set({ discountCode: null }),
      totalPaise: () => get().lines.reduce((sum, l) => sum + l.price_paise * l.quantity, 0),
      totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
      discountPaise: () => {
        const subtotal = get().totalPaise();
        const code = get().discountCode;
        if (!code || subtotal <= 0) return 0;
        const found = findSystemDiscountCode(code);
        if (!found || subtotal < found.minOrderPaise) return 0;
        const raw = computeSystemDiscountAmount(found, subtotal);
        // 0 shipping for kitchly
        return clampDiscountForMinTotal(subtotal, raw, 0).discount;
      },
      finalTotalPaise: (shippingPaise = 0) => {
        const subtotal = get().totalPaise();
        const discount = get().discountPaise();
        return Math.max(0, subtotal - discount + shippingPaise);
      },
    }),
    { name: 'kitchly-cart' }
  )
);
