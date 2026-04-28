'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addLine: (line: Omit<CartLine, 'quantity'>, qty?: number) => void;
  removeLine: (variant_id: string) => void;
  setQuantity: (variant_id: string, quantity: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  totalPaise: () => number;
  totalItems: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
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
      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ isOpen: open }),
      totalPaise: () => get().lines.reduce((sum, l) => sum + l.price_paise * l.quantity, 0),
      totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0)
    }),
    { name: 'kitchly-cart' }
  )
);
