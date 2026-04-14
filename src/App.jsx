import { useState, useMemo, useCallback, useEffect } from 'react'
import { sampleData } from './data/sampleData'
import Header          from './components/Header'
import Sidebar         from './components/Sidebar'
import HeroBanner      from './components/HeroBanner'
import Toolbar         from './components/Toolbar'
import ItemCard        from './components/ItemCard'
import ItemRow         from './components/ItemRow'
import ItemDetailModal from './components/ItemDetailModal'
import AddEditModal    from './components/AddEditModal'
import BulkUploadModal from './components/BulkUploadModal'

// ── LocalStorage persistence ──────────────────────────────────────────────────
const STORAGE_KEY    = 'hardwarehub_v1'
const SCHEMA_VERSION = 1

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.version === SCHEMA_VERSION && Array.isArray(parsed.items)) {
        return parsed.items
      }
    }
  } catch {}
  // Stale / missing → reset to sample data
  return sampleData
}

function persistItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION, items }))
  } catch {}
}

function loadDarkMode() {
  try { return localStorage.getItem('hardwarehub_dark') === 'true' } catch { return false }
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  // ─ State ─
  const [items,            setItems]           = useState(loadItems)
  const [darkMode,         setDarkMode]        = useState(loadDarkMode)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery,      setSearchQuery]     = useState('')
  const [stockFilter,      setStockFilter]     = useState('all')
  const [viewMode,         setViewMode]        = useState('grid')

  const [selectedItem,  setSelectedItem]  = useState(null)
  const [editingItem,   setEditingItem]   = useState(null)
  const [showAddModal,  setShowAddModal]  = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)

  // ─ Effects ─
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    try { localStorage.setItem('hardwarehub_dark', darkMode) } catch {}
  }, [darkMode])

  useEffect(() => { persistItems(items) }, [items])

  // ─ Derived ─
  const filteredItems = useMemo(() => {
    let result = items

    if (selectedCategory !== 'all') {
      result = result.filter(i => i.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(i =>
        i.name.toLowerCase().includes(q)        ||
        i.sku.toLowerCase().includes(q)         ||
        i.category.toLowerCase().includes(q)    ||
        (i.size        && i.size.toLowerCase().includes(q))        ||
        (i.description && i.description.toLowerCase().includes(q))
      )
    }

    if (stockFilter === 'out-of-stock') {
      result = result.filter(i => i.quantity === 0)
    } else if (stockFilter === 'low-stock') {
      result = result.filter(i => i.quantity > 0 && i.quantity <= i.minStock)
    } else if (stockFilter === 'in-stock') {
      result = result.filter(i => i.quantity > i.minStock)
    }

    return result
  }, [items, selectedCategory, searchQuery, stockFilter])

  const stats = useMemo(() => ({
    totalItems: items.length,
    outOfStock: items.filter(i => i.quantity === 0).length,
    lowStock:   items.filter(i => i.quantity > 0 && i.quantity <= i.minStock).length,
    totalValue: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  }), [items])

  const categoryCounts = useMemo(() => {
    const counts = {}
    items.forEach(i => { counts[i.category] = (counts[i.category] ?? 0) + 1 })
    return counts
  }, [items])

  const stockStatusCounts = useMemo(() => ({
    inStock:    items.filter(i => i.quantity > i.minStock).length,
    lowStock:   items.filter(i => i.quantity > 0 && i.quantity <= i.minStock).length,
    outOfStock: items.filter(i => i.quantity === 0).length,
  }), [items])

  // ─ Handlers ─
  const handleAddItem = useCallback(newItem => {
    setItems(prev => [...prev, { ...newItem, id: `ITEM-${Date.now()}` }])
  }, [])

  const handleEditItem = useCallback(updated => {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
  }, [])

  const handleDeleteItem = useCallback(id => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const handleBulkImport = useCallback(newItems => {
    setItems(prev => {
      const existingSkus = new Set(prev.map(i => i.sku))
      const toAdd = newItems
        .filter(i => !existingSkus.has(i.sku))
        .map((item, idx) => ({ ...item, id: `BULK-${Date.now()}-${idx}` }))
      return [...prev, ...toAdd]
    })
  }, [])

  const openEdit = useCallback(item => {
    setSelectedItem(null)
    setEditingItem(item)
  }, [])

  // ─ Render ─
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      {/* Fixed header */}
      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddItem={() => setShowAddModal(true)}
        onBulkUpload={() => setShowBulkModal(true)}
      />

      {/* Body: sidebar + main */}
      <div style={{ display: 'flex', paddingTop: '64px' }}>
        {/* Fixed sidebar */}
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
          stockStatusCounts={stockStatusCounts}
        />

        {/* Scrollable main */}
        <main
          style={{
            flex: 1,
            marginLeft: '256px',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <HeroBanner stats={stats} />

          <div style={{ padding: '24px' }}>
            <Toolbar
              count={filteredItems.length}
              stockFilter={stockFilter}
              onStockFilterChange={setStockFilter}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {/* Item grid / list */}
            {filteredItems.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  color: 'var(--muted-foreground)',
                  animation: 'fadeIn 0.3s ease both',
                }}
              >
                <div style={{ fontSize: '56px', marginBottom: '14px' }}>📦</div>
                <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px', color: 'var(--foreground)' }}>
                  No items found
                </div>
                <div style={{ fontSize: '13.5px' }}>
                  Try adjusting your search query or filters.
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div
                key="grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '18px',
                  animation: 'fadeIn 0.25s ease both',
                }}
              >
                {filteredItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            ) : (
              <div key="list" style={{ animation: 'fadeIn 0.25s ease both' }}>
                {filteredItems.map(item => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Modals ── */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onEdit={openEdit}
          onDelete={id => { handleDeleteItem(id); setSelectedItem(null) }}
        />
      )}

      {(showAddModal || editingItem) && (
        <AddEditModal
          item={editingItem}
          onClose={() => { setShowAddModal(false); setEditingItem(null) }}
          onSave={item => {
            if (editingItem) handleEditItem(item)
            else             handleAddItem(item)
            setShowAddModal(false)
            setEditingItem(null)
          }}
        />
      )}

      {showBulkModal && (
        <BulkUploadModal
          onClose={() => setShowBulkModal(false)}
          onImport={newItems => { handleBulkImport(newItems) }}
          existingSkus={items.map(i => i.sku)}
        />
      )}
    </div>
  )
}
