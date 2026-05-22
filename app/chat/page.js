'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState(null)
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [receiverEmail, setReceiverEmail] = useState('')

  useEffect(() => {
    setup()
  }, [])

  async function setup() {
    const params = new URLSearchParams(window.location.search)
    const listingId = params.get('listing_id')
    const receiver = params.get('receiver')
    setReceiverEmail(receiver)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/'; return }
    setUser(user)

    if (listingId) {
      const { data } = await supabase.from('listings').select('*').eq('id', listingId).single()
      setListing(data)
    }

    fetchMessages(listingId, user.email, receiver)
    setLoading(false)
  }

  async function fetchMessages(listingId, senderEmail, receiverEmail) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('listing_id', listingId)
      .or(`sender_email.eq.${senderEmail},receiver_email.eq.${senderEmail}`)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  async function sendMessage() {
    if (!newMessage.trim()) return
    const { error } = await supabase.from('messages').insert([{
      listing_id: listing?.id,
      sender_email: user.email,
      receiver_email: receiverEmail,
      message: newMessage
    }])
    if (!error) {
      setMessages([...messages, {
        sender_email: user.email,
        receiver_email: receiverEmail,
        message: newMessage,
        created_at: new Date().toISOString()
      }])
      setNewMessage('')
    }
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '32px' }}>⏳</div>

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7F2', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#1B5E20', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0 }}>
        <span onClick={() => window.history.back()} style={{ fontSize: '20px', color: '#A5D6A7', cursor: 'pointer' }}>←</span>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', margin: '0 0 2px' }}>{listing?.title || 'Chat'}</p>
          <p style={{ color: '#A5D6A7', fontSize: '11px', margin: 0 }}>{receiverEmail}</p>
        </div>
        <span style={{ fontSize: '20px' }}>🛍️</span>
      </div>

      {/* Listing preview */}
      {listing && (
        <div style={{ backgroundColor: '#E8F5E9', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #C8E6C9' }}>
          <span style={{ fontSize: '24px' }}>{listing.emoji || '📦'}</span>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 2px' }}>{listing.title}</p>
            <p style={{ fontSize: '12px', color: '#1B5E20', fontWeight: '500', margin: 0 }}>R{listing.price}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', paddingBottom: '80px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888780' }}>
            <p style={{ fontSize: '32px', margin: '0 0 10px' }}>💬</p>
            <p style={{ margin: 0 }}>No messages yet. Say hello!</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.sender_email === user?.email
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', backgroundColor: isMe ? '#1B5E20' : '#FFFFFF', border: isMe ? 'none' : '1px solid #C8E6C9' }}>
                <p style={{ fontSize: '14px', color: isMe ? '#FFFFFF' : '#2C2C2A', margin: '0 0 4px' }}>{msg.message}</p>
                <p style={{ fontSize: '10px', color: isMe ? '#A5D6A7' : '#888780', margin: 0 }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTop: '1px solid #C8E6C9', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: '12px 14px', borderRadius: '24px', border: '1px solid #C8E6C9', fontSize: '14px', outline: 'none', backgroundColor: '#F5F7F2' }}
        />
        <button onClick={sendMessage}
          style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#1B5E20', color: '#FFFFFF', border: 'none', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ➤
        </button>
      </div>

    </div>
  )
}