'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/'; return }
    setUser(user)
    const { data } = await supabase.from('listings').select('*').eq('seller_email', user.email)
    setListings(data || [])
    setLoading(false)
  }

  async function markAsSold(id) {
    await supabase.from('listings').update({ status: 'Sold' }).eq('id', id)
    setListings(listings.map(l => l.id === id ? { ...l, status: 'Sold' } : l))
  }

  async function deleteListing(id) {
    await supabase.from('listings').delete().eq('id', id)
    setListings(listings.filter(l => l.id !== id))
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '32px' }}>⏳</div>

  const sold = listings.filter(l => l.status === 'Sold').length
  const initials = user?.email?.substring(0, 2).toUpperCase()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7F2', fontFamily: 'Inter, sans-serif', paddingBottom: '40px' }}>

      <div style={{ backgroundColor: '#1B5E20', padding: '20px 16px 24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#F9A825', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', color: '#1B5E20' }}>{initials}</div>
        <div>
          <p style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '700', margin: '0 0 3px' }}>{user?.email}</p>
          <p style={{ color: '#A5D6A7', fontSize: '12px', margin: 0 }}>UNIVEN Student</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-around', padding: '16px 0', borderBottom: '1px solid #C8E6C9' }}>
        {[[listings.length, 'Listings'], [sold, 'Sold'], [listings.length - sold, 'Active']].map(([num, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#1B5E20', margin: '0 0 2px' }}>{num}</p>
            <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        <p style={{ fontSize: '15px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 12px' }}>My listings</p>

        {listings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888780' }}>
            <p style={{ fontSize: '32px', margin: '0 0 10px' }}>📭</p>
            <p>You have no listings yet</p>
          </div>
        )}

        {listings.map(item => (
          <div key={item.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #C8E6C9', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
              {item.image_url ? <img src={item.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} /> : item.emoji || '📦'}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 3px' }}>{item.title}</p>
              <p style={{ fontSize: '13px', color: '#1B5E20', fontWeight: '500', margin: '0 0 2px' }}>R{item.price}</p>
              <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', fontWeight: '500', backgroundColor: item.status === 'Sold' ? '#FCEBEB' : '#E8F5E9', color: item.status === 'Sold' ? '#A32D2D' : '#2E7D32' }}>{item.status}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {item.status !== 'Sold' && (
                <button onClick={() => markAsSold(item.id)} style={{ fontSize: '10px', padding: '4px 8px', backgroundColor: '#F9A825', color: '#1B5E20', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Sold</button>
              )}
              <button onClick={() => deleteListing(item.id)} style={{ fontSize: '10px', padding: '4px 8px', backgroundColor: '#FCEBEB', color: '#A32D2D', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Delete</button>
            </div>
          </div>
        ))}

        <button onClick={() => window.location.href = '/sell'}
          style={{ width: '100%', padding: '15px', backgroundColor: 'transparent', color: '#1B5E20', border: '2px solid #1B5E20', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '6px' }}>
          + Add new listing
        </button>

        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}
          style={{ width: '100%', padding: '15px', backgroundColor: '#FCEBEB', color: '#A32D2D', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' }}>
          Log out
        </button>
      </div>
    </div>
  )
}