import { useEffect, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { X, Upload, Download, CheckCircle2, AlertCircle } from 'lucide-react'

const REQUIRED_COLS = ['name', 'sku', 'category', 'quantity', 'minStock', 'price', 'unit']
const VALID_CATS    = ['fasteners','hand-tools','power-tools','electrical','plumbing','lumber','paint','safety','adhesives','measuring']

// ── Step indicator ────────────────────────────────────────────────────────────
function StepDot({ step, current, label }) {
  const done   = step < current
  const active = step === current
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: `2px solid ${done || active ? 'var(--primary)' : 'var(--border)'}`,
          backgroundColor: done ? 'var(--primary)' : active ? 'var(--primary)' : 'transparent',
          color: done || active ? '#ffffff' : 'var(--muted-foreground)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          transition: 'all 0.2s',
        }}
      >
        {done ? '✓' : step}
      </div>
      <span style={{ fontSize: '11px', color: active ? 'var(--primary)' : 'var(--muted-foreground)', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </div>
  )
}

function StepLine({ done }) {
  return (
    <div
      style={{
        flex: 1,
        height: '2px',
        backgroundColor: done ? 'var(--primary)' : 'var(--border)',
        marginTop: '-18px',
        transition: 'background-color 0.2s',
        maxWidth: '80px',
      }}
    />
  )
}

// ── Download template ─────────────────────────────────────────────────────────
function downloadTemplate() {
  const ws = XLSX.utils.aoa_to_sheet([
    ['name', 'sku', 'category', 'quantity', 'minStock', 'price', 'unit', 'size', 'description'],
    ['Hex Head Bolt M10×50', 'FST-HXB-9901', 'fasteners', 100, 20, 8, 'pcs', 'M10×50mm', 'IS 1364 zinc-plated hex bolt'],
    ['Ball Pein Hammer 500g', 'HTL-HAM-9902', 'hand-tools', 15, 5, 185, 'pcs', '500g', 'IS 841 forged steel hammer'],
  ])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Items')
  XLSX.writeFile(wb, 'hardwarehub_template.xlsx')
}

// ── Parse & validate a row ────────────────────────────────────────────────────
function parseRow(row, idx) {
  const name     = String(row.name     ?? '').trim()
  const sku      = String(row.sku      ?? '').trim().toUpperCase()
  const category = String(row.category ?? '').trim().toLowerCase()
  const quantity = Number(row.quantity ?? 0)
  const minStock = Number(row.minStock ?? 0)
  const price    = Number(row.price    ?? 0)
  const unit     = String(row.unit     ?? 'pcs').trim()
  const size     = String(row.size     ?? '').trim()
  const description = String(row.description ?? '').trim()

  const errors = []
  if (!name)                           errors.push('name missing')
  if (!sku)                            errors.push('SKU missing')
  if (!VALID_CATS.includes(category))  errors.push(`invalid category "${category}"`)
  if (isNaN(quantity) || quantity < 0) errors.push('invalid quantity')
  if (isNaN(price)    || price    <= 0) errors.push('invalid price')

  return { _row: idx + 2, name, sku, category, quantity, minStock, price, unit, size, description, _errors: errors, _skip: false }
}

// ── Step 1: Upload ────────────────────────────────────────────────────────────
function Step1({ onParsed }) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()

  const processFile = file => {
    setError('')
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      setError('Unsupported file format. Please upload .xlsx, .xls, or .csv')
      return
    }
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target.result)
        const wb   = XLSX.read(data, { type: 'array' })
        const ws   = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(ws, { raw: false, defval: '' })
        if (rows.length === 0) { setError('The file is empty.'); return }
        const missing = REQUIRED_COLS.filter(c => !Object.keys(rows[0]).includes(c))
        if (missing.length > 0) { setError(`Missing columns: ${missing.join(', ')}`); return }
        onParsed(rows.map(parseRow))
      } catch {
        setError('Failed to read the file. Make sure it is a valid Excel or CSV file.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const onDrop = e => {
    e.preventDefault()
    setDragging(false)
    processFile(e.dataTransfer.files[0])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Drag-drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: '12px',
          padding: '40px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragging ? 'var(--muted)' : 'var(--secondary)',
          transition: 'all 0.15s ease',
          boxShadow: dragging ? 'inset 0 0 0 2px var(--primary)' : 'none',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          style={{ display: 'none' }}
          onChange={e => processFile(e.target.files[0])}
        />
        <div style={{ fontSize: '36px', marginBottom: '10px' }}>📂</div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '6px' }}>
          Drop your file here or click to browse
        </div>
        <div style={{ fontSize: '12.5px', color: 'var(--muted-foreground)' }}>
          Supported formats:
        </div>
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
          {['.xlsx', '.xls', '.csv'].map(ext => (
            <span
              key={ext}
              style={{
                padding: '2px 10px',
                borderRadius: '10px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                backgroundColor: 'var(--muted)',
                color: 'var(--primary)',
                border: '1px solid var(--border)',
              }}
            >
              {ext}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--status-out-bg)', border: '1px solid var(--status-out-color)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <AlertCircle size={15} color="var(--status-out-color)" style={{ flexShrink: 0, marginTop: '1px' }} />
          <span style={{ fontSize: '13px', color: 'var(--status-out-text)' }}>{error}</span>
        </div>
      )}

      {/* Template download */}
      <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: 'var(--accent)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--foreground)', marginBottom: '8px' }}>
          Need a template? Download the Excel template with sample rows.
        </div>
        <button
          onClick={e => { e.stopPropagation(); downloadTemplate() }}
          style={{
            padding: '7px 16px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(217,119,6,0.25)',
          }}
        >
          <Download size={14} />
          Download Template
        </button>
      </div>
    </div>
  )
}

// ── Step 2: Preview ────────────────────────────────────────────────────────────
function Step2({ rows, existingSkus, onRowsChange, onImport }) {
  const [importHover, setImportHover] = useState(false)

  const validRows  = rows.filter(r => r._errors.length === 0 && !r._skip)
  const dupRows    = rows.filter(r => existingSkus.includes(r.sku))
  const errorRows  = rows.filter(r => r._errors.length > 0)

  const toggleSkip = idx => {
    onRowsChange(rows.map((r, i) => i === idx ? { ...r, _skip: !r._skip } : r))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {[
          { label: 'Total Rows',   val: rows.length,      color: 'var(--primary)' },
          { label: 'Ready',        val: validRows.length, color: 'var(--status-in-color)' },
          { label: 'Errors/Skip',  val: (errorRows.length + rows.filter(r => r._skip).length), color: 'var(--status-out-color)' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>{val}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Duplicate notice */}
      {dupRows.length > 0 && (
        <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--status-low-bg)', border: '1px solid var(--status-low-color)', fontSize: '12.5px', color: 'var(--status-low-text)' }}>
          ⚠ {dupRows.length} row{dupRows.length > 1 ? 's have' : ' has'} SKU{dupRows.length > 1 ? 's' : ''} that already exist in inventory. Toggle to skip them.
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
              {['Row', 'Name', 'SKU', 'Category', 'Qty', 'Price', 'Status / Action'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--font-mono)', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isDup  = existingSkus.includes(row.sku)
              const hasErr = row._errors.length > 0
              const bg     = hasErr ? 'var(--status-out-bg)' : isDup ? 'var(--status-low-bg)' : row._skip ? 'var(--muted)' : 'var(--card)'
              return (
                <tr key={i} style={{ backgroundColor: bg, borderBottom: '1px solid var(--border)', opacity: row._skip ? 0.5 : 1 }}>
                  <td style={{ padding: '7px 10px', fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>{row._row}</td>
                  <td style={{ padding: '7px 10px', fontWeight: 500, color: 'var(--foreground)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name || '—'}</td>
                  <td style={{ padding: '7px 10px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted-foreground)' }}>{row.sku || '—'}</td>
                  <td style={{ padding: '7px 10px' }}>
                    <span style={{ padding: '2px 7px', borderRadius: '5px', backgroundColor: 'var(--muted)', color: 'var(--primary)', fontSize: '11px', fontWeight: 500, textTransform: 'capitalize' }}>
                      {row.category || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '7px 10px', fontFamily: 'var(--font-mono)' }}>{row.quantity}</td>
                  <td style={{ padding: '7px 10px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>₹{row.price}</td>
                  <td style={{ padding: '7px 10px' }}>
                    {hasErr ? (
                      <span style={{ color: 'var(--status-out-text)', fontSize: '11px' }}>⚠ {row._errors.join('; ')}</span>
                    ) : isDup ? (
                      <button
                        onClick={() => toggleSkip(i)}
                        style={{
                          padding: '3px 9px',
                          borderRadius: '6px',
                          border: `1.5px solid ${row._skip ? 'var(--border)' : 'var(--status-low-color)'}`,
                          backgroundColor: row._skip ? 'transparent' : 'var(--status-low-bg)',
                          color: row._skip ? 'var(--muted-foreground)' : 'var(--status-low-text)',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {row._skip ? 'Include' : 'Skip (dup)'}
                      </button>
                    ) : (
                      <span style={{ color: 'var(--status-in-text)', fontSize: '11px', fontWeight: 600 }}>✓ Ready</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => onImport(validRows)}
          onMouseEnter={() => setImportHover(true)}
          onMouseLeave={() => setImportHover(false)}
          disabled={validRows.length === 0}
          style={{
            padding: '9px 24px',
            borderRadius: '8px',
            border: 'none',
            background: validRows.length === 0 ? 'var(--muted)' : importHover ? 'linear-gradient(135deg, #b45309, #92400e)' : 'linear-gradient(135deg, #d97706, #b45309)',
            color: validRows.length === 0 ? 'var(--muted-foreground)' : '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: validRows.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            boxShadow: validRows.length > 0 ? '0 2px 8px rgba(217,119,6,0.3)' : 'none',
            transition: 'background 0.15s, box-shadow 0.15s',
          }}
        >
          <Upload size={15} />
          Import {validRows.length} item{validRows.length !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  )
}

// ── Step 3: Success ────────────────────────────────────────────────────────────
function Step3({ count, onClose }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 20px' }}>
      <div style={{ fontSize: '56px', marginBottom: '12px', animation: 'scaleIn 0.4s ease both' }}>🎉</div>
      <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginBottom: '8px', animation: 'scaleIn 0.35s ease 0.1s both' }}>
        +{count}
      </div>
      <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '6px' }}>
        Items imported successfully!
      </div>
      <div style={{ fontSize: '13.5px', color: 'var(--muted-foreground)', marginBottom: '28px' }}>
        {count} new item{count !== 1 ? 's have' : ' has'} been added to your inventory.
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button
          onClick={onClose}
          style={{
            padding: '9px 28px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            boxShadow: '0 2px 8px rgba(217,119,6,0.3)',
          }}
        >
          <CheckCircle2 size={16} />
          View Inventory
        </button>
      </div>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function BulkUploadModal({ onClose, onImport, existingSkus }) {
  const [step, setStep]   = useState(1)
  const [rows, setRows]   = useState([])
  const [imported, setImported] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  const handleParsed = parsed => {
    setRows(parsed)
    setStep(2)
  }

  const handleImport = validRows => {
    const count = validRows.length
    onImport(validRows)
    setImported(count)
    setStep(3)
  }

  const stepLabels = ['Upload', 'Preview', 'Done']

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
        padding: '20px',
        animation: 'fadeIn 0.2s ease both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
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
        {/* Header */}
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
              Import Inventory
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-serif)' }}>
              Bulk Upload Items
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Step indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: '0',
            padding: '20px 32px 0',
            backgroundColor: 'var(--card)',
          }}
        >
          {stepLabels.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start' }}>
              <StepDot step={i + 1} current={step} label={label} />
              {i < stepLabels.length - 1 && <StepLine done={step > i + 1} />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '20px 24px 24px', flex: 1 }}>
          {step === 1 && <Step1 onParsed={handleParsed} />}
          {step === 2 && (
            <Step2
              rows={rows}
              existingSkus={existingSkus}
              onRowsChange={setRows}
              onImport={handleImport}
            />
          )}
          {step === 3 && <Step3 count={imported} onClose={onClose} />}
        </div>

        {/* Footer nav (steps 1-2 only) */}
        {step < 3 && (
          <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--card)' }}>
            <button
              onClick={step === 1 ? onClose : () => setStep(s => s - 1)}
              style={{ padding: '7px 18px', borderRadius: '8px', border: '1.5px solid var(--border)', backgroundColor: 'var(--accent)', color: 'var(--foreground)', fontSize: '13.5px', fontWeight: 500, cursor: 'pointer' }}
            >
              {step === 1 ? 'Cancel' : '← Back'}
            </button>
            {step === 1 && (
              <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center' }}>
                Upload a file to proceed
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
