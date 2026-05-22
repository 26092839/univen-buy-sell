'use client'

const myListings = [
  { id: 1, title: 'Law Notes Sem 1', price: 'R30', interested: 5, emoji: '📝', bg: '#E8F5E9' },
  { id: 2, title: 'Student Backpack', price: 'R200', interested: 2, emoji: '🎒', bg: '#FFF8E1' },
  { id: 3, title: 'Biology Textbook', price: 'R150', interested: 3, emoji: '📚', bg: '#E3F2FD' },
]

export default function ProfilePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7F2', fontFamily: 'Inter, sans-serif', paddingBottom: '40px' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#1B5E20', padding: '20px 16px 24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#F9A825', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', color: '#1B5E20', flexShrink: 0 }}>MR</div>
        <div>
          <p style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '700', margin: '0 0 3px' }}>Mulalo Ravele</p>
          <p style={{ color: '#A5D6A7', fontSize: '12px', margin: 0 }}>UNIVEN · Law · 2nd year · s21001234</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-around', padding: '16px 0', borderBottom: '1px solid #C8E6C9' }}>
        {[['5', 'Listings'], ['11', 'Sold'], ['4.9 ⭐', 'Rating']].map(([num, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#1B5E20', margin: '0 0 2px' }}>{num}</p>
            <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px' }}>

        <p style={{ fontSize: '15px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 12px' }}>My active listings</p>

        {/* Listings */}
        {myListings.map(item => (
          <div key={item.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #C8E6C9', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{item.emoji}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 3px' }}>{item.title}</p>
              <p style={{ fontSize: '13px', color: '#1B5E20', fontWeight: '500', margin: '0 0 2px' }}>{item.price}</p>
              <p style={{ fontSize: '11px', color: '#888780', margin: 0 }}>{item.interested} interested</p>
            </div>
            <span style={{ fontSize: '20px', cursor: 'pointer' }}>✏️</span>
          </div>
        ))}

        {/* Add New */}
        <button style={{ width: '100%', padding: '15px', backgroundColor: 'transparent', color: '#1B5E20', border: '2px solid #1B5E20', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '6px' }}>
          + Add new listing
        </button>

      </div>
    </div>
  )
}