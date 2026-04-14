import {
  Wrench, Hammer, Zap, Lightbulb, Droplets, TreePine,
  Paintbrush, ShieldCheck, FlaskConical, Ruler,
  Package, Settings, Layers, Eye, HardHat, Gauge,
  Wind, Scissors, Anchor, Palette, Square, Minus,
  ScanLine, Shield,
} from 'lucide-react'

// ── Category defaults ──────────────────────────────────────────────────────
export const CATEGORY_ICON = {
  'fasteners':   Wrench,
  'hand-tools':  Hammer,
  'power-tools': Zap,
  'electrical':  Lightbulb,
  'plumbing':    Droplets,
  'lumber':      TreePine,
  'paint':       Paintbrush,
  'safety':      ShieldCheck,
  'adhesives':   FlaskConical,
  'measuring':   Ruler,
}

// Each category has its own warm amber/orange gradient
export const CATEGORY_GRADIENT = {
  'fasteners':   { from: '#b45309', to: '#78350f' },
  'hand-tools':  { from: '#d97706', to: '#92400e' },
  'power-tools': { from: '#c2410c', to: '#7c2d12' },
  'electrical':  { from: '#f59e0b', to: '#d97706' },
  'plumbing':    { from: '#ea580c', to: '#c2410c' },
  'lumber':      { from: '#a16207', to: '#713f12' },
  'paint':       { from: '#f59e0b', to: '#d97706' },
  'safety':      { from: '#dc2626', to: '#991b1b' },
  'adhesives':   { from: '#b45309', to: '#92400e' },
  'measuring':   { from: '#92400e', to: '#78350f' },
}

// Keyword → icon overrides (checked against lower-case item name, first match wins)
const KEYWORD_ICONS = [
  // Safety (specific before generic)
  ['helmet',      HardHat],
  ['harness',     Shield],
  ['goggles',     Eye],
  ['mask',        Wind],
  ['gloves',      ShieldCheck],

  // Hand tools
  ['hammer',      Hammer],
  ['hacksaw',     Scissors],
  ['chisel',      Scissors],
  ['screwdriver', Wrench],
  ['spanner',     Wrench],

  // Power tools
  ['grinder',     Zap],
  ['jigsaw',      Scissors],
  ['sander',      Settings],
  ['rotary',      Settings],
  ['drill',       Settings],

  // Electrical
  ['mcb',         Zap],
  ['circuit',     Zap],
  ['wire',        Zap],
  ['conduit',     Minus],
  ['batten',      Lightbulb],
  ['led',         Lightbulb],
  ['junction',    Package],

  // Plumbing
  ['valve',       Settings],
  ['elbow',       Minus],
  ['pipe',        Minus],
  ['ptfe',        Ruler],
  ['teflon',      Ruler],

  // Lumber – boards/sheets before trees
  ['plywood',     Layers],
  ['mdf',         Layers],
  ['board',       Layers],
  ['plank',       Layers],
  ['bamboo',      TreePine],
  ['teak',        TreePine],
  ['sheesham',    TreePine],
  ['log',         TreePine],

  // Paint
  ['enamel',      Paintbrush],
  ['emulsion',    Paintbrush],
  ['weathercoat', Paintbrush],
  ['primer',      Paintbrush],
  ['stain',       Palette],
  ['paint',       Paintbrush],

  // Adhesives
  ['fevicol',     FlaskConical],
  ['araldite',    FlaskConical],
  ['epoxy',       FlaskConical],
  ['sealant',     FlaskConical],
  ['fixit',       FlaskConical],
  ['m-seal',      FlaskConical],

  // Measuring
  ['caliper',     Gauge],
  ['vernier',     Gauge],
  ['level',       Gauge],
  ['square',      Square],
  ['laser',       ScanLine],
  ['tape',        Ruler],

  // Fasteners
  ['anchor',      Anchor],
  ['bolt',        Wrench],
  ['screw',       Wrench],
  ['nut',         Wrench],
  ['washer',      Wrench],
]

/** Returns the best Lucide icon component for a given item. */
export function getItemIcon(item) {
  const nameLower = item.name.toLowerCase()
  for (const [keyword, Icon] of KEYWORD_ICONS) {
    if (nameLower.includes(keyword)) return Icon
  }
  return CATEGORY_ICON[item.category] ?? Package
}

/** Returns a CSS linear-gradient string for a category. */
export function getCategoryGradient(category) {
  const g = CATEGORY_GRADIENT[category] ?? { from: '#d97706', to: '#b45309' }
  return `linear-gradient(135deg, ${g.from}, ${g.to})`
}

/** Returns the stock status key for an item. */
export function getStockStatus(item) {
  if (item.quantity === 0)               return 'out'
  if (item.quantity <= item.minStock)    return 'low'
  return 'in'
}

/** Returns colours for a stock status key. */
export const STATUS_CONFIG = {
  out: {
    label: 'Out of Stock',
    color: 'var(--status-out-color)',
    bg:    'var(--status-out-bg)',
    text:  'var(--status-out-text)',
    bar:   '#dc2626',
  },
  low: {
    label: 'Low Stock',
    color: 'var(--status-low-color)',
    bg:    'var(--status-low-bg)',
    text:  'var(--status-low-text)',
    bar:   '#d97706',
  },
  in: {
    label: 'In Stock',
    color: 'var(--status-in-color)',
    bg:    'var(--status-in-bg)',
    text:  'var(--status-in-text)',
    bar:   '#16a34a',
  },
}

/** Progress bar fill percentage: 0 → 100. Full at 3× minStock. */
export function stockFillPct(item) {
  if (item.quantity === 0) return 0
  const optimal = item.minStock > 0 ? item.minStock * 3 : item.quantity
  return Math.min(100, Math.round((item.quantity / optimal) * 100))
}

/** Format a price in Indian Rupees. */
export function formatINR(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })
}
