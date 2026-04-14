function StatCard({ label, value, note }) {
  return (
    <div
      style={{
        padding: '20px 28px',
        textAlign: 'center',
        flex: 1,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '32px',
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1,
          marginBottom: '6px',
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '12.5px',
          color: 'rgba(255,255,255,0.82)',
          fontWeight: 500,
          letterSpacing: '0.02em',
        }}
      >
        {label}
      </div>
      {note && (
        <div
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.55)',
            marginTop: '3px',
          }}
        >
          {note}
        </div>
      )}
    </div>
  )
}

function Divider() {
  return (
    <div
      style={{
        width: '1px',
        backgroundColor: 'rgba(255,255,255,0.18)',
        margin: '12px 0',
        flexShrink: 0,
      }}
    />
  )
}

export default function HeroBanner({ stats }) {
  const fmtNum = n => Number(n).toLocaleString('en-IN')

  const fmtValue = n => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)} Cr`
    if (n >= 1_00_000)    return `₹${(n / 1_00_000).toFixed(1)} L`
    return '₹' + fmtNum(n)
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* ── Gradient banner ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #d97706 0%, #b45309 55%, #92400e 100%)',
          padding: '28px 32px 20px',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        {[
          { top: '-30px', right: '60px',  size: '130px', opacity: '0.06' },
          { top: '5px',   right: '160px', size: '65px',  opacity: '0.09' },
          { bottom: '-40px', right: '20px',  size: '170px', opacity: '0.05' },
          { top: '15px',  left: '42%',    size: '85px',  opacity: '0.06' },
          { bottom: '-15px', left: '25%', size: '50px',  opacity: '0.08' },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: c.top,
              right: c.right,
              bottom: c.bottom,
              left: c.left,
              width: c.size,
              height: c.size,
              borderRadius: '50%',
              backgroundColor: `rgba(255,255,255,${c.opacity})`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Title */}
        <div style={{ marginBottom: '20px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            Inventory Overview
          </div>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.2,
            }}
          >
            HardwareHub Dashboard
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            position: 'relative',
            zIndex: 1,
            background: 'rgba(0,0,0,0.08)',
            borderRadius: '12px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <StatCard label="Total Items" value={fmtNum(stats.totalItems)} />
          <Divider />
          <StatCard label="Out of Stock" value={fmtNum(stats.outOfStock)} note="Needs restocking" />
          <Divider />
          <StatCard label="Low Stock" value={fmtNum(stats.lowStock)} note="Below minimum" />
          <Divider />
          <StatCard label="Inventory Value" value={fmtValue(stats.totalValue)} />
        </div>
      </div>

      {/* ── Alert strip ── */}
      {stats.outOfStock > 0 && (
        <div
          style={{
            backgroundColor: 'var(--status-out-bg)',
            borderTop: '1px solid var(--status-out-color)',
            padding: '8px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'slideIn 0.3s ease both',
          }}
        >
          <span style={{ fontSize: '14px' }}>⚠️</span>
          <span
            style={{
              color: 'var(--status-out-text)',
              fontSize: '12.5px',
              fontWeight: 500,
            }}
          >
            {stats.outOfStock} item{stats.outOfStock > 1 ? 's are' : ' is'} out of stock — immediate restocking required
          </span>
        </div>
      )}
    </div>
  )
}
