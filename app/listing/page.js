'use client'

export default function ListingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7F2', fontFamily: 'Inter, sans-serif', paddingBottom: '40px' }}>

      <div style={{ height: '220px', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>
        📚
      </div>

      <div style={{ backgroundColor: '#1B5E20', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '20px', color: '#A5D6A7', cursor: 'pointer' }}>←</span>
        <span style={{ color: '#A5D6A7', fontSize: '13px' }}>Listing detail</span>
        <span style={{ fontSize: '20px', cursor: 'pointer' }}>🤍</span>
      </div>

      <div style={{ padding: '16px' }}>

        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 4px' }}>Biology Textbook</h1>
        <p style={{ fontSize: '13px', color: '#888780', margin: '0 0 10px' }}>3rd Edition · Good condition</p>
        <p style={{ fontSize: '26px', fontWeight: '700', color: '#1B5E20', margin: '0 0 12px' }}>R150</p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <span style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '12px', padding: '4px 10px', borderRadius: '6px' }}>Books</span>
          <span style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '12px', padding: '4px 10px', borderRadius: '6px' }}>Biology</span>
          <span style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '12px', padding: '4px 10px', borderRadius: '6px' }}>2nd year</span>
        </div>

        <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '16px' }}>
          No writing inside, spine intact. Great for BIO201 at UNIVEN. Meet at Main Library or Res 3 gate.
        </p>

        <div style={{ backgroundColor: '#F5F7F2', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', border: '1px solid #C8E6C9' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: '#1B5E20' }}>TN</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 2px' }}>Tshifhiwa Ndou</p>
            <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>UNIVEN · Life Sciences · Yr 3 · 7 sales</p>
          </div>
          <p style={{ fontSize: '14px', color: '#F9A825', fontWeight: '700', margin: 0 }}>⭐ 4.8</p>
        </div>

        <button style={{ width: '100%', padding: '16px', backgroundColor: '#1B5E20', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginBottom: '12px' }}>
          💬 Message seller
        </button>

        <button style={{ width: '100%', padding: '15px', backgroundColor: '#F9A825', color: '#1B5E20', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
          Make an offer
        </button>

      </div>
    </div>
  )
}