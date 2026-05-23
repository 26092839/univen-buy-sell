'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function ChatsPage() {
  const [conversations, setConversations] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getConversations()
  }, [])

  async function getConversations() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/'; return }
    setUser(user)

    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_email.eq.${user.email},receiver_email.eq.${user.email}`)
      .order('created_at', { ascending: false })

    if (data) {
      const seen = {}
      const unique = []
      data.forEach(msg => {
        const other = msg.sender_email === user.email
          ? msg.receiver_email
          : msg.sender_email
        const key = `${msg.listing_id}-${other}`
        if (!seen[key]) {
          seen[key] = true
          unique.push({ ...msg, otherEmail: other })
        }
      })
      setConversations(unique)
    }
    setLoading(false)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '32px' }}>⏳</div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7F2', fontFamily: 'Inter, sans-serif', paddingBottom: '70px' }}>

      <div style={{ backgroundColor: '#1B5E20', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '34px', height: '34px', backgroundColor: '#F9A825', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💬</div>
        <div>
          <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>My Chats</div>
          <div style={{ color: '#A5D6A7', fontSize: '11px' }}>University of Venda</div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>

        {conversations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888780' }}>
            <p style={{ fontSize: '48px', margin: '0 0 16px' }}>💬</p>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 8px' }}>No chats yet</p>
            <p style={{ fontSize: '13px', margin: '0 0 24px' }}>When a buyer messages you about your listing it will appear here</p>
            <button onClick={() => window.location.href = '/home'}
              style={{ padding: '12px 24px', backgroundColor: '#1B5E20', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              Browse listings
            </button>
          </div>
        )}

        {conversations.map((msg, i) => {
          const isMe = msg.sender_email === user?.email
          const initials = msg.otherEmail?.substring(0, 2).toUpperCase()
          return (
            <div key={i}
              onClick={() => window.location.href = `/chat?listing_id=${msg.listing_id}&receiver=${msg.otherEmail}`}
              style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #C8E6C9', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', cursor: 'pointer' }}>

              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: '#1B5E20', flexShrink: 0 }}>
                {initials}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {msg.otherEmail}
                </p>
                <p style={{ fontSize: '12px', color: '#888780', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {isMe ? 'You: ' : '📩 New: '}{msg.message}
                </p>
              </div>

              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <p style={{ fontSize: '11px', color: '#888780', margin: '0 0 4px' }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {!isMe && (
                  <span style={{ backgroundColor: '#1B5E20', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>New</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTop: '1px solid #C8E6C9', display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
        {[['🏠', 'Home', '/home'], ['🔍', 'Browse', '/home'], ['➕', 'Sell', '/sell'], ['💬', 'Chats', '/chats'], ['👤', 'Profile', '/profile']].map(([icon, label, link]) => (
          <a key={label} href={link} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
            <span style={{ fontSize: '20px' }}>{icon}</span>
            <span style={{ fontSize: '10px', color: label === 'Chats' ? '#1B5E20' : '#888780', fontWeight: label === 'Chats' ? '600' : '400' }}>{label}</span>
          </a>
        ))}
      </div>

    </div>
  )
}