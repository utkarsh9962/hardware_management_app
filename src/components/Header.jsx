import { useState } from 'react'
import { Search, Moon, Sun, Upload, Plus, X } from 'lucide-react'

export default function Header({ darkMode, onToggleDark, searchQuery, onSearchChange, onAddItem, onBulkUpload }) {
  const [focused, setFocused] = useState(false)
  const [addHover, setAddHover] = useState(false)
  const [bulkHover, setBulkHover] = useState(false)
  const [darkHover, setDarkHover] = useState(false)

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        height: '64px',
        backgroundColor: 'var(--card)',
        borderBottom: '1.5px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: '14px',
        boxShadow: '0 1px 12px rgba(217,119,6,0.08)',
        transition: 'background-color 0.2s',
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
          minWidth: '200px',
        }}
      >
        <span style={{ fontSize: '26px', lineHeight: 1 }}>🔧</span>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '17px',
              fontWeight: 700,
              color: 'var(--primary)',
              lineHeight: 1.15,
              letterSpacing: '0.01em',
            }}
          >
            HardwareHub
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9.5px',
              color: 'var(--muted-foreground)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Inventory Manager
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div style={{ flex: 1, maxWidth: '520px', position: 'relative' }}>
        <Search
          size={15}
          style={{
            position: 'absolute',
            left: '11px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: focused ? 'var(--primary)' : 'var(--muted-foreground)',
            pointerEvents: 'none',
            transition: 'color 0.15s',
          }}
        />
        <input
          type="text"
          placeholder="Search name, SKU, category, size…"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: '8px 32px 8px 34px',
            borderRadius: '8px',
            border: `1.5px solid ${focused ? 'var(--primary)' : 'var(--border)'}`,
            backgroundColor: 'var(--input)',
            color: 'var(--foreground)',
            fontSize: '13.5px',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
            boxShadow: focused ? '0 0 0 3px rgba(217,119,6,0.15)' : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
              border: 'none',
              borderRadius: '50%',
              backgroundColor: 'var(--muted-foreground)',
              color: 'var(--card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <X size={10} />
          </button>
        )}
      </div>

      {/* ── Right actions ── */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Dark mode */}
        <button
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={onToggleDark}
          onMouseEnter={() => setDarkHover(true)}
          onMouseLeave={() => setDarkHover(false)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1.5px solid var(--border)',
            backgroundColor: darkHover ? 'var(--muted)' : 'var(--accent)',
            color: 'var(--foreground)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background-color 0.15s',
          }}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Bulk Upload */}
        <button
          onClick={onBulkUpload}
          onMouseEnter={() => setBulkHover(true)}
          onMouseLeave={() => setBulkHover(false)}
          style={{
            padding: '7px 14px',
            borderRadius: '8px',
            border: '1.5px solid var(--border)',
            backgroundColor: bulkHover ? 'var(--muted)' : 'var(--accent)',
            color: 'var(--foreground)',
            fontSize: '13.5px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            transition: 'background-color 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          <Upload size={14} />
          Bulk Upload
        </button>

        {/* Add Inventory */}
        <button
          onClick={onAddItem}
          onMouseEnter={() => setAddHover(true)}
          onMouseLeave={() => setAddHover(false)}
          style={{
            padding: '7px 18px',
            borderRadius: '8px',
            border: 'none',
            background: addHover
              ? 'linear-gradient(135deg, #b45309, #92400e)'
              : 'linear-gradient(135deg, #d97706, #b45309)',
            color: '#ffffff',
            fontSize: '13.5px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            boxShadow: addHover
              ? '0 4px 16px rgba(217,119,6,0.45)'
              : '0 2px 8px rgba(217,119,6,0.3)',
            transition: 'background 0.15s, box-shadow 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          <Plus size={15} />
          Add Inventory
        </button>
      </div>
    </header>
  )
}
