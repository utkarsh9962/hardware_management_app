import { useEffect, useState } from 'react'
import { X, Save } from 'lucide-react'

const CATEGORIES = [
  'fasteners', 'hand-tools', 'power-tools', 'electrical',
  'plumbing', 'lumber', 'paint', 'safety', 'adhesives', 'measuring',
]

const UNITS = ['pcs', 'set', 'pair', 'roll', 'litre', 'kg', 'm', 'ft', 'box']

const EMPTY = {
  name: '', sku: '', category: '', quantity: '', minStock: '',
  price: '', unit: 'pcs', size: '', description: '',
}

function Field({ label, error, required, children }) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--foreground)',
          marginBottom: '5px',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
        {required && <span style={{ color: 'var(--status-out-color)', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
      {error && (
        <div
          style={{
            fontSize: '11.5px',
            color: 'var(--status-out-color)',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          ⚠ {error}
        </div>
      )}
    </div>
  )
}

const inputStyle = (focused, error) => ({
  width: '100%',
  padding: '9px 12px',
  borderRadius: '8px',
  border: `1.5px solid ${error ? 'var(--status-out-color)' : focused ? 'var(--primary)' : 'var(--border)'}`,
  backgroundColor: 'var(--input)',
  color: 'var(--foreground)',
  fontSize: '13.5px',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  boxShadow: focused
    ? error
      ? '0 0 0 3px rgba(220,38,38,0.12)'
      : '0 0 0 3px rgba(217,119,6,0.15)'
    : 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
})

export default function AddEditModal({ item, onClose, onSave }) {
  const isEdit = Boolean(item)
  const [form, setForm] = useState(isEdit ? { ...item, quantity: String(item.quantity), minStock: String(item.minStock), price: String(item.price) } : { ...EMPTY })
  const [errors, setErrors] = useState({})
  const [focused, setFocused] = useState('')
  const [saveHover, setSaveHover] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())        e.name     = 'Name is required'
    if (!form.sku.trim())         e.sku      = 'SKU is required'
    if (!form.category)           e.category = 'Category is required'
    if (form.quantity === '' || isNaN(Number(form.quantity)) || Number(form.quantity) < 0)
      e.quantity = 'Enter a valid quantity (0 or more)'
    if (form.minStock === '' || isNaN(Number(form.minStock)) || Number(form.minStock) < 0)
      e.minStock = 'Enter a valid minimum stock level'
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = 'Price must be greater than ₹0'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave({
      ...(isEdit ? item : {}),
      name:        form.name.trim(),
      sku:         form.sku.trim().toUpperCase(),
      category:    form.category,
      quantity:    Math.max(0, Math.round(Number(form.quantity))),
      minStock:    Math.max(0, Math.round(Number(form.minStock))),
      price:       parseFloat(Number(form.price).toFixed(2)),
      unit:        form.unit,
      size:        form.size.trim(),
      description: form.description.trim(),
    })
  }

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
          maxWidth: '580px',
          maxHeight: '92vh',
          backgroundColor: 'var(--card)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'scaleIn 0.22s ease both',
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '3px' }}>
              {isEdit ? 'Edit Item' : 'New Item'}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-serif)' }}>
              {isEdit ? `Editing: ${item.name.substring(0, 30)}${item.name.length > 30 ? '…' : ''}` : 'Add Inventory Item'}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '8px', border: 'none',
              backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable form ── */}
        <div style={{ overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Name */}
          <Field label="Item Name" required error={errors.name}>
            <input
              type="text"
              value={form.name}
              placeholder="e.g. Hex Head Bolt M10×50"
              onChange={e => set('name', e.target.value)}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused('')}
              style={inputStyle(focused === 'name', errors.name)}
            />
          </Field>

          {/* SKU + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="SKU" required error={errors.sku}>
              <input
                type="text"
                value={form.sku}
                placeholder="FST-HXB-0001"
                onChange={e => set('sku', e.target.value)}
                onFocus={() => setFocused('sku')}
                onBlur={() => setFocused('')}
                style={{ ...inputStyle(focused === 'sku', errors.sku), fontFamily: 'var(--font-mono)' }}
              />
            </Field>
            <Field label="Category" required error={errors.category}>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                onFocus={() => setFocused('category')}
                onBlur={() => setFocused('')}
                style={{ ...inputStyle(focused === 'category', errors.category), textTransform: 'capitalize' }}
              >
                <option value="">Select category…</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c} style={{ textTransform: 'capitalize' }}>
                    {c.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Quantity + Min Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Quantity" required error={errors.quantity}>
              <input
                type="number"
                value={form.quantity}
                min="0"
                placeholder="0"
                onChange={e => set('quantity', e.target.value)}
                onFocus={() => setFocused('quantity')}
                onBlur={() => setFocused('')}
                style={inputStyle(focused === 'quantity', errors.quantity)}
              />
            </Field>
            <Field label="Min Stock Level" required error={errors.minStock}>
              <input
                type="number"
                value={form.minStock}
                min="0"
                placeholder="10"
                onChange={e => set('minStock', e.target.value)}
                onFocus={() => setFocused('minStock')}
                onBlur={() => setFocused('')}
                style={inputStyle(focused === 'minStock', errors.minStock)}
              />
            </Field>
          </div>

          {/* Price + Unit */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Unit Price (₹)" required error={errors.price}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', fontWeight: 700, fontSize: '14px', pointerEvents: 'none', fontFamily: 'var(--font-mono)' }}>₹</span>
                <input
                  type="number"
                  value={form.price}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  onChange={e => set('price', e.target.value)}
                  onFocus={() => setFocused('price')}
                  onBlur={() => setFocused('')}
                  style={{ ...inputStyle(focused === 'price', errors.price), paddingLeft: '26px', fontFamily: 'var(--font-mono)' }}
                />
              </div>
            </Field>
            <Field label="Unit">
              <select
                value={form.unit}
                onChange={e => set('unit', e.target.value)}
                onFocus={() => setFocused('unit')}
                onBlur={() => setFocused('')}
                style={inputStyle(focused === 'unit', false)}
              >
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </Field>
          </div>

          {/* Size */}
          <Field label="Size / Specification">
            <input
              type="text"
              value={form.size}
              placeholder="e.g. M10×50mm, 750W, 25mm × 3m"
              onChange={e => set('size', e.target.value)}
              onFocus={() => setFocused('size')}
              onBlur={() => setFocused('')}
              style={{ ...inputStyle(focused === 'size', false), fontFamily: 'var(--font-mono)' }}
            />
          </Field>

          {/* Description */}
          <Field label="Description">
            <textarea
              value={form.description}
              placeholder="Product details, standards (IS/BIS/ISI), certifications…"
              rows={3}
              onChange={e => set('description', e.target.value)}
              onFocus={() => setFocused('description')}
              onBlur={() => setFocused('')}
              style={{ ...inputStyle(focused === 'description', false), resize: 'vertical', minHeight: '80px' }}
            />
          </Field>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            backgroundColor: 'var(--card)',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: '1.5px solid var(--border)',
              backgroundColor: 'var(--accent)',
              color: 'var(--foreground)',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            onMouseEnter={() => setSaveHover(true)}
            onMouseLeave={() => setSaveHover(false)}
            style={{
              padding: '8px 22px',
              borderRadius: '8px',
              border: 'none',
              background: saveHover
                ? 'linear-gradient(135deg, #b45309, #92400e)'
                : 'linear-gradient(135deg, #d97706, #b45309)',
              color: '#ffffff',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: saveHover ? '0 4px 16px rgba(217,119,6,0.45)' : '0 2px 8px rgba(217,119,6,0.3)',
              transition: 'background 0.15s, box-shadow 0.15s',
            }}
          >
            <Save size={14} />
            {isEdit ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  )
}
