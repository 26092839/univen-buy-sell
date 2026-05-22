'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const categories = ['All', 'Books', 'Electronics', 'Notes', 'Uniforms', 'Other']

export default function HomePage() {
  const [listings, setListings] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchListings()
  }, [])

 async function fetchListings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('listings')
      .select('*')
    if (error) {
      console.log('Error:', error.message)
    } else {
      setListings(data || [])
    }
    setLoading(false)
  }

  const filtered = listings.filter(l => {
    const matchCat = activeCategory === 'All' || l.category === activeCategory
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7F2', fontFamily: 'Inter, sans-serif', paddingBottom: '70px' }}>

      <div style={{ backgroundColor: '#1B5E20', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', backgroundColor: '#F9A825', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🛍️</div>
          <div>
            <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>UNIVEN Buy & Sell</div>
            <div style={{ color: '#A5D6A7', fontSize: '11px' }}>University of Venda</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '20px' }}>
          <span style={{ cursor: 'pointer' }}>🔔</span>
          <span style={{ cursor: 'pointer' }}>💬</span>
        </div>
      </div>

      <div style={{ padding: '16px' }}>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #C8E6C9', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <span>🔍</span>
          <input type="text" placeholder="Search textbooks, uniforms…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: '14px', width: '100%', color: '#2C2C2A', backgroundColor: 'transparent' }} />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ padding: '6px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '500', backgroundColor: activeCategory === cat ? '#1B5E20' : '#E8F5E9', color: activeCategory === cat ? '#FFFFFF' : '#2E7D32' }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '15px', fontWeight: '600', color: '#2C2C2A', marginBottom: '12px' }}>
          Latest listings {!loading && `(${filtered.length})`}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888780' }}>
            <p style={{ fontSize: '32px', margin: '0 0 10px' }}>⏳</p>
            <p style={{ margin: 0 }}>Loading listings...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888780' }}>
            <p style={{ fontSize: '32px', margin: '0 0 10px' }}>📭</p>
            <p style={{ margin: 0 }}>No listings found</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {filtered.map(item => (
            <div key={item.id} onClick={() => window.location.href = `/listing?id=${item.id}`} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #C8E6C9', overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ height: '90px', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', overflow: 'hidden' }}>
  {item.image_url
    ? <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    : item.emoji || '📦'}
</div>
              <div style={{ padding: '8px 10px' }}>
                <p style={{ fontSize: '13px', fontWeight: '500', color: '#2C2C2A', margin: '0 0 4px' }}>{item.title}</p>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#1B5E20', margin: '0 0 4px' }}>R{item.price}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <p style={{ fontSize: '11px', color: '#888780', margin: 0 }}>{item.seller_name}</p>
                  {item.status === 'New' && <span style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '10px', padding: '1px 6px', borderRadius: '4px', fontWeight: '500' }}>New</span>}
                  {item.status === 'Sold' && <span style={{ backgroundColor: '#FCEBEB', color: '#A32D2D', fontSize: '10px', padding: '1px 6px', borderRadius: '4px', fontWeight: '500' }}>Sold</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTop: '1px solid #C8E6C9', display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
        {[['🏠', 'Home', '/home'], ['🔍', 'Browse', '/home'], ['➕', 'Sell', '/sell'], ['💬', 'Chats', '/home'], ['👤', 'Profile', '/profile']].map(([icon, label, link]) => (
          <a key={label} href={link} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer', textDecoration: 'none' }}>
            <span style={{ fontSize: '20px' }}>{icon}</span>
            <span style={{ fontSize: '10px', color: label === 'Home' ? '#1B5E20' : '#888780', fontWeight: label === 'Home' ? '600' : '400' }}>{label}</span>
          </a>
        ))}
      </div>

    </div>
  )
}