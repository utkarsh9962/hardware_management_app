import { useState } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES } from '../data/sampleData'

export default function Sidebar({ selectedCategory, onSelectCategory, categoryCounts, stockStatusCounts, isMobile, isOpen, onClose }) {
  const [hoveredCat, setHoveredCat] = useState(null)
  const totalItems = Object.values(categoryCounts).reduce((a, b) => a + b, 0)

  const getCount = (catId) => catId === 'all' ? totalItems : (categoryCounts[catId] ?? 0)

  const sidebarStyle = isMobile
    ? {
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '280px',
        zIndex: 250,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
      }
    : {
        position: 'fixed',
        left: 0,
        top: '56px',
        bottom: 0,
        width: '256px',
        zIndex: 100,
      }

  return (
    <aside
      style={{
        ...sidebarStyle,
        backgroundColor: 'var(--sidebar)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '12px 10px 16px',
        transition: isMobile ? 'transform 0.25s ease' : 'background-color 0.2s',
      }}
    >
      {/* Mobile header row with close button */}
      {isMobile && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px 12px',
            borderBottom: '1px solid var(--border)',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '20px' }}>🔧</span>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--primary)',
              }}
            >
              HardwareHub
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              border: '1.5px solid var(--border)',
              backgroundColor: 'var(--accent)',
              color: 'var(--foreground)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Categories label */}
      <div
        style={{
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          color: 'var(--muted-foreground)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '4px 10px 10px',
        }}
      >
        Categories
      </div>

      {/* Category list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat.id
          const isHovered = hoveredCat === cat.id && !isActive
          const count = getCount(cat.id)

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              onMouseEnter={() => setHoveredCat(cat.id)}
              onMouseLeave={() => setHoveredCat(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                padding: isMobile ? '10px 10px' : '8px 10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                backgroundColor: isActive
                  ? 'var(--primary)'
                  : isHovered
                  ? 'var(--muted)'
                  : 'transparent',
                color: isActive ? '#ffffff' : 'var(--foreground)',
                fontFamily: 'var(--font-sans)',
                transition: 'background-color 0.12s, color 0.12s',
              }}
            >
              <span style={{ fontSize: '15px', flexShrink: 0, lineHeight: 1 }}>
                {cat.emoji}
              </span>
              <span
                style={{
                  flex: 1,
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {cat.label}
              </span>
              <span
                style={{
                  padding: '1px 7px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  flexShrink: 0,
                  backgroundColor: isActive ? 'rgba(255,255,255,0.22)' : 'var(--muted)',
                  color: isActive ? '#ffffff' : 'var(--primary)',
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Stock status panel */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: 'var(--muted-foreground)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '4px 10px 10px',
          }}
        >
          Stock Status
        </div>

        {[
          {
            label: 'In Stock',
            count: stockStatusCounts.inStock,
            dotColor: 'var(--status-in-color)',
            textColor: 'var(--status-in-color)',
          },
          {
            label: 'Low Stock',
            count: stockStatusCounts.lowStock,
            dotColor: 'var(--status-low-color)',
            textColor: 'var(--status-low-color)',
          },
          {
            label: 'Out of Stock',
            count: stockStatusCounts.outOfStock,
            dotColor: 'var(--status-out-color)',
            textColor: 'var(--status-out-color)',
          },
        ].map(({ label, count, dotColor, textColor }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 10px',
              borderRadius: '8px',
              marginBottom: '2px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: dotColor,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '12.5px',
                flex: 1,
                color: 'var(--foreground)',
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: textColor,
              }}
            >
              {count}
            </span>
          </div>
        ))}
      </div>
    </aside>
  )
}
