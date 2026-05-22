'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function ListingPage() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)

 useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    console.log('Listing ID:', id)
    if (id) {
      fetchListing(id)
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchListing(id) {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()
    console.log('Data:', data)
    console.log('Error:', error)
    setListing(data)
    setLoading(false)
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '32px' }}>⏳</div>
  if (!listing) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#888' }}>Listing not found</div>

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7F2', fontFamily: 'Inter, sans-serif', paddingBottom: '40px' }}>

      <div style={{ height: '220px', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>
        {listing.emoji || '📦'}
      </div>

      <div style={{ backgroundColor: '#1B5E20', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span onClick={() => window.history.back()} style={{ fontSize: '20px', color: '#A5D6A7', cursor: 'pointer' }}>←</span>
        <span style={{ color: '#A5D6A7', fontSize: '13px' }}>Listing detail</span>
        <span style={{ fontSize: '20px', cursor: 'pointer' }}>🤍</span>
      </div>

      <div style={{ padding: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 4px' }}>{listing.title}</h1>
        <p style={{ fontSize: '13px', color: '#888780', margin: '0 0 10px' }}>{listing.condition} condition</p>
        <p style={{ fontSize: '26px', fontWeight: '700', color: '#1B5E20', margin: '0 0 12px' }}>R{listing.price}</p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '12px', padding: '4px 10px', borderRadius: '6px' }}>{listing.category}</span>
          <span style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '12px', padding: '4px 10px', borderRadius: '6px' }}>{listing.condition}</span>
        </div>

        <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '16px' }}>{listing.description}</p>

        <div style={{ backgroundColor: '#F5F7F2', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', border: '1px solid #C8E6C9' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: '#1B5E20' }}>
            {listing.seller_name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 2px' }}>{listing.seller_name}</p>
            <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>📍 Meetup: {listing.meetup}</p>
          </div>
        </div>

        <a href={`mailto:${listing.seller_email}?subject=Interested in ${listing.title}&body=Hi, I am interested in your listing: ${listing.title} for R${listing.price}`}
          style={{ display: 'block', width: '100%', padding: '16px', backgroundColor: '#1B5E20', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginBottom: '12px', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}>
          💬 Message seller
        </a>

        <button onClick={() => window.location.href = '/home'}
          style={{ width: '100%', padding: '15px', backgroundColor: '#F9A825', color: '#1B5E20', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
          ← Back to listings
        </button>
      </div>
    </div>
  )
}