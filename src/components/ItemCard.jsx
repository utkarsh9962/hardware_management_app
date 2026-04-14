import { useState } from 'react'
import {
  getItemIcon,
  getCategoryGradient,
  getStockStatus,
  STATUS_CONFIG,
  stockFillPct,
  formatINR,
} from '../utils/iconMap'

export default function ItemCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false)

  const status   = getStockStatus(item)
  const cfg      = STATUS_CONFIG[status]
  const fillPct  = stockFillPct(item)
  const IconComp = getItemIcon(item)
  const catGrad  = getCategoryGradient(item.category)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: 'var(--card)',
        borderRadius: '12px',
        border: `1px solid ${hovered ? 'var(--primary)' : 'var(--border)'}`,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-amber-hover)' : 'var(--shadow-sm)',
        animation: 'scaleIn 0.22s ease both',
      }}
    >
      {/* ── Status accent bar ── */}
      <div
        style={{
          height: '4px',
          backgroundColor: cfg.color,
          flexShrink: 0,
        }}
      />

      {/* ── Card body ── */}
      <div style={{ padding: '16px 16px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Icon + category */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: catGrad,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <IconComp size={20} color="#ffffff" strokeWidth={1.8} />
          </div>

          {/* Status pill */}
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '10.5px',
              fontWeight: 600,
              backgroundColor: cfg.bg,
              color: cfg.text,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Name */}
        <div>
          <div
            style={{
              fontSize: '13.5px',
              fontWeight: 600,
              color: 'var(--foreground)',
              lineHeight: 1.35,
              marginBottom: '3px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {item.name}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--muted-foreground)',
            }}
          >
            {item.sku}
          </div>
        </div>

        {/* Size badge */}
        {item.size && (
          <span
            style={{
              alignSelf: 'flex-start',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              backgroundColor: 'var(--muted)',
              color: 'var(--muted-foreground)',
              border: '1px solid var(--border)',
            }}
          >
            {item.size}
          </span>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Quantity bar */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '5px',
            }}
          >
            <span style={{ fontSize: '11.5px', color: 'var(--muted-foreground)' }}>
              Qty: <strong style={{ color: 'var(--foreground)' }}>{item.quantity.toLocaleString('en-IN')}</strong>
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>
              Min: {item.minStock.toLocaleString('en-IN')}
            </span>
          </div>
          <div
            style={{
              height: '5px',
              borderRadius: '3px',
              backgroundColor: 'var(--muted)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${fillPct}%`,
                height: '100%',
                borderRadius: '3px',
                background: 'linear-gradient(90deg, #d97706, #f59e0b)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Price + unit */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--primary)',
            }}
          >
            {formatINR(item.price)}
          </span>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--muted-foreground)',
              backgroundColor: 'var(--accent)',
              padding: '1px 6px',
              borderRadius: '4px',
            }}
          >
            per {item.unit}
          </span>
        </div>
      </div>
    </div>
  )
}
