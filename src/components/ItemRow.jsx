import { useState } from 'react'
import {
  getItemIcon,
  getCategoryGradient,
  getStockStatus,
  STATUS_CONFIG,
  stockFillPct,
  formatINR,
} from '../utils/iconMap'

export default function ItemRow({ item, onClick }) {
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
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '12px 16px',
        backgroundColor: hovered ? 'var(--accent)' : 'var(--card)',
        borderRadius: '10px',
        border: `1px solid ${hovered ? 'var(--primary)' : 'var(--border)'}`,
        cursor: 'pointer',
        marginBottom: '6px',
        transition: 'all 0.12s ease',
        animation: 'slideInRight 0.2s ease both',
        boxShadow: hovered ? 'var(--shadow-amber)' : 'var(--shadow-sm)',
      }}
    >
      {/* Status bar (left edge) */}
      <div
        style={{
          width: '3px',
          height: '36px',
          borderRadius: '2px',
          backgroundColor: cfg.color,
          flexShrink: 0,
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '9px',
          background: catGrad,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <IconComp size={17} color="#ffffff" strokeWidth={1.8} />
      </div>

      {/* Name + SKU */}
      <div style={{ flex: '0 0 220px', minWidth: 0 }}>
        <div
          style={{
            fontSize: '13.5px',
            fontWeight: 600,
            color: 'var(--foreground)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.name}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--muted-foreground)',
            marginTop: '1px',
          }}
        >
          {item.sku}
        </div>
      </div>

      {/* Category badge */}
      <div style={{ flex: '0 0 100px', display: 'flex' }}>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 500,
            backgroundColor: 'var(--muted)',
            color: 'var(--primary)',
            border: '1px solid var(--border)',
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
          }}
        >
          {item.category.replace('-', ' ')}
        </span>
      </div>

      {/* Size */}
      <div
        style={{
          flex: '0 0 110px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11.5px',
          color: 'var(--muted-foreground)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {item.size || '—'}
      </div>

      {/* Quantity bar */}
      <div style={{ flex: 1, minWidth: '100px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>
            {item.quantity.toLocaleString('en-IN')} {item.unit}
          </span>
        </div>
        <div
          style={{
            height: '4px',
            borderRadius: '2px',
            backgroundColor: 'var(--muted)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${fillPct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #d97706, #f59e0b)',
              borderRadius: '2px',
            }}
          />
        </div>
      </div>

      {/* Status pill */}
      <div style={{ flex: '0 0 100px', display: 'flex', justifyContent: 'center' }}>
        <span
          style={{
            padding: '3px 9px',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: 600,
            backgroundColor: cfg.bg,
            color: cfg.text,
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'nowrap',
          }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Price */}
      <div style={{ flex: '0 0 90px', textAlign: 'right' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--primary)',
          }}
        >
          {formatINR(item.price)}
        </span>
        <div style={{ fontSize: '10.5px', color: 'var(--muted-foreground)', marginTop: '1px' }}>
          /{item.unit}
        </div>
      </div>
    </div>
  )
}
