import { useEffect, useState } from 'react'
import { X, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import {
  getItemIcon,
  getCategoryGradient,
  getStockStatus,
  STATUS_CONFIG,
  stockFillPct,
  formatINR,
} from '../utils/iconMap'

function MetaCard({ label, value }) {
  return (
    <div
      style={{
        padding: '12px 14px',
        borderRadius: '8px',
        backgroundColor: 'var(--muted)',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ fontSize: '10.5px', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
        {label}
      </div>
      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--foreground)', wordBreak: 'break-word' }}>
        {value}
      </div>
    </div>
  )
}

export default function ItemDetailModal({ item, onClose, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  const status   = getStockStatus(item)
  const cfg      = STATUS_CONFIG[status]
  const fillPct  = stockFillPct(item)
  const IconComp = getItemIcon(item)
  const catGrad  = getCategoryGradient(item.category)
  const totalVal = item.price * item.quantity

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(3px)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        animation: 'fadeIn 0.2s ease both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          backgroundColor: 'var(--card)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'scaleIn 0.22s ease both',
        }}
      >
        {/* ── Gradient header ── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            padding: '24px 24px 20px',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            {/* Icon */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.2)',
                border: '1.5px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IconComp size={26} color="#ffffff" strokeWidth={1.6} />
            </div>

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.65)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '3px',
                }}
              >
                {item.category.replace('-', ' ')} · {item.sku}
              </div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1.3,
                  fontFamily: 'var(--font-serif)',
                }}
              >
                {item.name}
              </div>
            </div>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quantity block */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'var(--secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Stock</div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--foreground)', lineHeight: 1, fontFamily: 'var(--font-sans)' }}>
                  {item.quantity.toLocaleString('en-IN')}
                  <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--muted-foreground)', marginLeft: '6px' }}>{item.unit}</span>
                </div>
              </div>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: cfg.bg,
                  color: cfg.text,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {cfg.label}
              </span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div
                style={{
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--muted)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${fillPct}%`,
                    height: '100%',
                    borderRadius: '4px',
                    background: 'linear-gradient(90deg, #d97706, #f59e0b)',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--muted-foreground)' }}>
              <span>Min stock level: <strong style={{ color: 'var(--foreground)' }}>{item.minStock}</strong></span>
              <span>{fillPct}% of target</span>
            </div>

            {/* Reorder alert */}
            {(status === 'out' || status === 'low') && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: cfg.bg,
                  border: `1px solid ${cfg.color}`,
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center',
                }}
              >
                <AlertTriangle size={14} color={cfg.text} />
                <span style={{ fontSize: '12px', color: cfg.text, fontWeight: 500 }}>
                  {status === 'out'
                    ? 'Stock depleted — place a reorder immediately'
                    : `Stock below minimum — reorder recommended (need ${item.minStock - item.quantity} more)`}
                </span>
              </div>
            )}
          </div>

          {/* Meta grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <MetaCard label="Unit Price" value={formatINR(item.price) + ' / ' + item.unit} />
            <MetaCard label="Total Value" value={formatINR(totalVal)} />
            <MetaCard label="SKU" value={item.sku} />
            <MetaCard label="Size / Spec" value={item.size || '—'} />
          </div>

          {/* Description */}
          {item.description && (
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                backgroundColor: 'var(--secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: '10.5px', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                Description
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--foreground)', lineHeight: 1.6, margin: 0 }}>
                {item.description}
              </p>
            </div>
          )}
        </div>

        {/* ── Footer actions ── */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '10px',
            justifyContent: 'space-between',
            backgroundColor: 'var(--card)',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            {confirmDelete ? (
              <>
                <span style={{ fontSize: '13px', color: 'var(--status-out-text)', display: 'flex', alignItems: 'center' }}>
                  Are you sure?
                </span>
                <button
                  onClick={() => onDelete(item.id)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--border)',
                    backgroundColor: 'transparent',
                    color: 'var(--foreground)',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border)',
                  backgroundColor: 'transparent',
                  color: 'var(--muted-foreground)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '5px',
                  alignItems: 'center',
                }}
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '7px 18px',
                borderRadius: '8px',
                border: '1.5px solid var(--border)',
                backgroundColor: 'var(--accent)',
                color: 'var(--foreground)',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
            <button
              onClick={() => onEdit(item)}
              style={{
                padding: '7px 20px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(217,119,6,0.3)',
              }}
            >
              <Pencil size={14} />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
