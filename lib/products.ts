export type Variant = {
  id: string;
  label: string;
  weight_g?: number;
  price_paise: number;
  stock_count: number;
  sku: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: 'cookware' | 'utensils' | 'serveware' | 'storage' | 'tools';
  base_price: number;
  compare_at_price?: number;
  images: string[];
  ingredients?: string[];
  highlights: string[];
  nutrition?: { label: string; value: string }[];
  variants: Variant[];
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  rating_count: number;
};

export const PRODUCTS: Product[] = [
  {
    id: 'p_001',
    slug: 'everyday-skillet-26',
    name: 'Everyday Skillet',
    tagline: 'The 26cm pan that does the work of three.',
    description:
      'A heavy-bottomed, ceramic non-stick skillet built for Indian kitchens — high enough to handle a curry, flat enough to land a perfect dosa. Stainless steel handle, oven-safe to 220°C, induction-ready.',
    category: 'cookware',
    base_price: 1799,
    compare_at_price: 2499,
    images: ['/images/skillet-1.jpg', '/images/skillet-2.jpg'],
    highlights: [
      '26cm cooking surface, 4cm sides',
      'Triple-coat ceramic, PFOA-free',
      'Stainless handle, oven-safe to 220°C',
      'Works on gas, induction & electric',
      '2-year non-stick warranty'
    ],
    variants: [
      {
        id: 'v_001a',
        label: 'Terracotta',
        price_paise: 179900,
        stock_count: 40,
        sku: 'KCH-SKL26-TER'
      },
      {
        id: 'v_001b',
        label: 'Charcoal',
        price_paise: 179900,
        stock_count: 28,
        sku: 'KCH-SKL26-CHR'
      }
    ],
    is_active: true,
    is_featured: true,
    rating: 4.8,
    rating_count: 412
  },
  {
    id: 'p_002',
    slug: 'forever-kadhai',
    name: 'Forever Kadhai',
    tagline: 'A 2.5L kadhai you will pass down.',
    description:
      'Pure cast iron, pre-seasoned with cold-pressed flax oil. Deepens with every use. Finally, a kadhai that handles a Sunday biryani and a weekday sabzi with equal ease.',
    category: 'cookware',
    base_price: 1999,
    compare_at_price: 2799,
    images: ['/images/kadhai-1.jpg', '/images/kadhai-2.jpg'],
    highlights: [
      '2.5L capacity, 24cm rim',
      'Pure cast iron, naturally non-stick over time',
      'Pre-seasoned, ready to use',
      'Iron-fortified cooking — yes, really',
      'Hand wash, oil after use'
    ],
    variants: [
      {
        id: 'v_002a',
        label: '2.5L',
        price_paise: 199900,
        stock_count: 22,
        sku: 'KCH-KDH25'
      },
      {
        id: 'v_002b',
        label: '4L Family',
        price_paise: 279900,
        stock_count: 14,
        sku: 'KCH-KDH40'
      }
    ],
    is_active: true,
    is_featured: true,
    rating: 4.9,
    rating_count: 287
  },
  {
    id: 'p_003',
    slug: 'wooden-spoon-set',
    name: 'Wooden Spoon Trio',
    tagline: 'Three teak spoons. One lifetime.',
    description:
      'Hand-turned in Channapatna from sustainably-harvested teak. Smooth on non-stick, kind on cast iron, and beautiful enough to leave on the counter.',
    category: 'utensils',
    base_price: 599,
    compare_at_price: 799,
    images: ['/images/spoons-1.jpg', '/images/spoons-2.jpg'],
    highlights: [
      'Set of 3 — flat, slotted, ladle',
      'Sustainably harvested teak',
      'Hand-turned in Channapatna',
      'Food-safe linseed finish',
      'Hand wash, oil monthly'
    ],
    variants: [
      {
        id: 'v_003a',
        label: 'Set of 3',
        price_paise: 59900,
        stock_count: 60,
        sku: 'KCH-WSP-SET3'
      }
    ],
    is_active: true,
    is_featured: true,
    rating: 4.7,
    rating_count: 189
  },
  {
    id: 'p_004',
    slug: 'stoneware-serving-bowl',
    name: 'Stoneware Serving Bowl',
    tagline: 'Goes from oven to table without apology.',
    description:
      'Reactive-glaze stoneware, fired in Khurja. Each bowl is one-of-one — no two glazes are quite the same. 1.4L capacity holds a sabzi for four, or a salad for a dinner party.',
    category: 'serveware',
    base_price: 999,
    compare_at_price: 1299,
    images: ['/images/bowl-1.jpg', '/images/bowl-2.jpg'],
    highlights: [
      '1.4L capacity, 22cm rim',
      'Hand-thrown stoneware, Khurja',
      'Oven-safe to 200°C',
      'Microwave & dishwasher safe',
      'Each piece has its own glaze pattern'
    ],
    variants: [
      {
        id: 'v_004a',
        label: 'Ember',
        price_paise: 99900,
        stock_count: 25,
        sku: 'KCH-SBW-EMB'
      },
      {
        id: 'v_004b',
        label: 'Ash',
        price_paise: 99900,
        stock_count: 18,
        sku: 'KCH-SBW-ASH'
      }
    ],
    is_active: true,
    is_featured: true,
    rating: 4.6,
    rating_count: 96
  },
  {
    id: 'p_005',
    slug: 'masala-tin-set',
    name: 'Masala Tin Set',
    tagline: 'A masala dabba that earns its counter spot.',
    description:
      'Stainless steel masala dabba with seven inner tins, a clear acrylic lid, and two precision-machined spoons. Holds the entire flavour vocabulary of an Indian kitchen.',
    category: 'storage',
    base_price: 1199,
    compare_at_price: 1499,
    images: ['/images/masala-1.jpg', '/images/masala-2.jpg'],
    highlights: [
      '7 inner tins, ~75g capacity each',
      '304-grade stainless, food safe',
      'Clear acrylic lid for instant scanning',
      'Two stainless spoons included',
      'Airtight outer seal'
    ],
    variants: [
      {
        id: 'v_005a',
        label: 'Standard',
        price_paise: 119900,
        stock_count: 50,
        sku: 'KCH-MTN-STD'
      }
    ],
    is_active: true,
    is_featured: false,
    rating: 4.8,
    rating_count: 144
  },
  {
    id: 'p_006',
    slug: 'precision-knife',
    name: 'Precision Chef Knife',
    tagline: 'A 20cm chef knife that holds an edge.',
    description:
      'Forged from German X50CrMov15 steel, balanced at the bolster, finished with a pakkawood handle. The only knife you actually need on the board.',
    category: 'tools',
    base_price: 1499,
    compare_at_price: 1999,
    images: ['/images/knife-1.jpg', '/images/knife-2.jpg'],
    highlights: [
      '20cm forged blade, 56 HRC',
      'X50CrMov15 German steel',
      'Pakkawood handle, full tang',
      'Hand-finished bevel',
      'Honing rod included'
    ],
    variants: [
      {
        id: 'v_006a',
        label: '20cm Chef',
        price_paise: 149900,
        stock_count: 32,
        sku: 'KCH-KNF-20'
      }
    ],
    is_active: true,
    is_featured: true,
    rating: 4.9,
    rating_count: 211
  }
];

export function getActiveProducts(): Product[] {
  return PRODUCTS.filter((p) => p.is_active);
}

export function getFeaturedProducts(n = 4): Product[] {
  return PRODUCTS.filter((p) => p.is_active && p.is_featured).slice(0, n);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug && p.is_active);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getRelatedProducts(slug: string, n = 3): Product[] {
  const current = getProductBySlug(slug);
  if (!current) return [];
  return PRODUCTS.filter(
    (p) => p.is_active && p.slug !== slug && p.category === current.category
  )
    .concat(PRODUCTS.filter((p) => p.is_active && p.slug !== slug && p.category !== current.category))
    .slice(0, n);
}

export function getMinVariantPaise(p: Product): number {
  return Math.min(...p.variants.map((v) => v.price_paise));
}

export function getVariantById(productId: string, variantId: string): Variant | undefined {
  return getProductById(productId)?.variants.find((v) => v.id === variantId);
}
