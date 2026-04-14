import { useState } from 'react'
import { LayoutGrid, List } from 'lucide-react'

const STOCK_CHIPS = [
  { id: 'all',           label: 'All' },
  { id: 'in-stock',      label: 'In Stock' },
  { id: 'low-stock',     label: 'Low Stock' },
  { id: 'out-of-stock',  label: 'Out of Stock' },
]

export default function Toolbar({ count, stockFilter, onStockFilterChange, viewMode, onViewModeChange }) {
  const [hoveredChip, setHoveredChip] = useState(null)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}
    >
      {/* Result count */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12.5px',
          color: 'var(--muted-foreground)',
          flexShrink: 0,
          minWidth: '80px',
        }}
      >
        {count} {count === 1 ? 'item' : 'items'}
      </div>

      {/* Stock filter chips */}
      <div style={{ display: 'flex', gap: '6px', flex: 1, flexWrap: 'wrap' }}>
        {STOCK_CHIPS.map(chip => {
          const isActive = stockFilter === chip.id
          const isHovered = hoveredChip === chip.id && !isActive
          return (
            <button
              key={chip.id}
              onClick={() => onStockFilterChange(chip.id)}
              onMouseEnter={() => setHoveredChip(chip.id)}
              onMouseLeave={() => setHoveredChip(null)}
              style={{
                padding: '5px 14px',
                borderRadius: '20px',
                border: `1.5px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                backgroundColor: isActive
                  ? 'var(--primary)'
                  : isHovered
                  ? 'var(--muted)'
                  : 'transparent',
                color: isActive ? '#ffffff' : 'var(--foreground)',
                fontSize: '12.5px',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.12s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {chip.label}
            </button>
          )
        })}
      </div>

      {/* View toggle */}
      <div
        style={{
          display: 'flex',
          border: '1.5px solid var(--border)',
          borderRadius: '8px',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {[
          { mode: 'grid', Icon: LayoutGrid, title: 'Grid view' },
          { mode: 'list', Icon: List,       title: 'List view' },
        ].map(({ mode, Icon, title }, idx) => (
          <button
            key={mode}
            title={title}
            onClick={() => onViewModeChange(mode)}
            style={{
              width: '36px',
              height: '34px',
              border: 'none',
              borderRight: idx === 0 ? '1px solid var(--border)' : 'none',
              backgroundColor: viewMode === mode ? 'var(--primary)' : 'var(--accent)',
              color: viewMode === mode ? '#ffffff' : 'var(--muted-foreground)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.12s, color 0.12s',
            }}
          >
            <Icon size={15} />
          </button>
        ))}
      </div>
    </div>
  )
}
