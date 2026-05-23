'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState(null)
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [receiverEmail, setReceiverEmail] = useState('')
  const [otherTyping, setOtherTyping] = useState(false)
  const bottomRef = useRef(null)
  const typingRef = useRef(null)
  const myEmail = useRef(null)
  const listingId = useRef(null)

  useEffect(() => { init() }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, otherTyping])

  async function init() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/'; return }
    myEmail.current = user.email
    setUser(user)

    const params = new URLSearchParams(window.location.search)
    const lid = params.get('listing_id')
    const receiver = params.get('receiver')
    listingId.current = lid
    setReceiverEmail(receiver)

    const { data: listingData } = await supabase.from('listings').select('*').eq('id', lid).single()
    setListing(listingData)

    const { data: msgs } = await supabase
      .from('messages')
      .select('*')
      .eq('listing_id', lid)
      .or(`and(sender_email.eq.${user.email},receiver_email.eq.${receiver}),and(sender_email.eq.${receiver},receiver_email.eq.${user.email})`)
      .order('created_at', { ascending: true })
    setMessages(msgs || [])
    setLoading(false)

    const channel = supabase.channel('room-' + lid + '-' + user.email)
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        if (payload.sender !== user.email) {
          setMessages(prev => [...prev, payload])
        }
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.sender !== user.email) {
          setOtherTyping(payload.typing)
        }
      })
      .subscribe()
  }

  async function handleTyping(e) {
    setNewMessage(e.target.value)
    const channel = supabase.channel('room-' + listingId.current + '-' + receiverEmail)
    await channel.send({ type: 'broadcast', event: 'typing', payload: { sender: myEmail.current, typing: true } })
    clearTimeout(typingRef.current)
    typingRef.current = setTimeout(async () => {
      await channel.send({ type: 'broadcast', event: 'typing', payload: { sender: myEmail.current, typing: false } })
    }, 2000)
  }

  async function sendMessage() {
    if (!newMessage.trim()) return
    const text = newMessage
    setNewMessage('')

    const msg = {
      listing_id: Number(listingId.current),
      sender_email: myEmail.current,
      receiver_email: receiverEmail,
      message: text,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase.from('messages').insert(msg).select()
    if (error) { alert('Error: ' + error.message); setNewMessage(text); return }

    setMessages(prev => [...prev, data[0]])

    const channel = supabase.channel('room-' + listingId.current + '-' + receiverEmail)
    await channel.send({ type: 'broadcast', event: 'message', payload: { ...data[0], sender: myEmail.current } })
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#1B5E20' }}>
      <p style={{ color: '#fff', fontSize: '32px' }}>⏳</p>
    </div>
  )

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', backgroundColor: '#ECE5DD' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#1B5E20', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <span onClick={() => window.history.back()} style={{ fontSize: '22px', color: '#A5D6A7', cursor: 'pointer' }}>←</span>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F9A825', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#1B5E20', flexShrink: 0 }}>
          {receiverEmail?.substring(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#fff', fontSize: '14px', fontWeight: '600', margin: '0 0 1px' }}>{receiverEmail}</p>
          <p style={{ color: '#A5D6A7', fontSize: '11px', margin: 0 }}>
            {otherTyping ? '✍️ typing...' : `About: ${listing?.title || ''}`}
          </p>
        </div>
      </div>

      {/* Listing bar */}
      {listing && (
        <div style={{ backgroundColor: '#fff', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #ddd', flexShrink: 0 }}>
          <span style={{ fontSize: '20px' }}>{listing.emoji || '📦'}</span>
          <div>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#2C2C2A', margin: 0 }}>{listing.title}</p>
            <p style={{ fontSize: '11px', color: '#1B5E20', margin: 0 }}>R{listing.price}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
            <p style={{ fontSize: '40px', margin: '0 0 10px' }}>👋</p>
            <p style={{ fontWeight: '600', color: '#2C2C2A', margin: '0 0 4px' }}>Start the conversation</p>
            <p style={{ fontSize: '13px', margin: 0 }}>Ask about the listing or make an offer</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.sender_email === myEmail.current
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '75%', padding: '8px 12px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', backgroundColor: isMe ? '#DCF8C6' : '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                <p style={{ fontSize: '14px', color: '#2C2C2A', margin: 0, wordBreak: 'break-word', lineHeight: '1.5' }}>{msg.message}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                  <span style={{ fontSize: '10px', color: '#888' }}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && <span style={{ fontSize: '11px', color: '#34B7F1' }}>✓✓</span>}
                </div>
              </div>
            </div>
          )
        })}

        {otherTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '10px 14px', borderRadius: '18px 18px 18px 4px', backgroundColor: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#888', display: 'inline-block', animation: 'bounce 1s infinite 0s' }}></span>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#888', display: 'inline-block', animation: 'bounce 1s infinite 0.2s' }}></span>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#888', display: 'inline-block', animation: 'bounce 1s infinite 0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ backgroundColor: '#F0F0F0', padding: '10px 12px', display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTyping}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: 'none', fontSize: '14px', outline: 'none', backgroundColor: '#fff', fontFamily: 'Inter, sans-serif', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
        />
        <button onClick={sendMessage}
          style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: '#1B5E20', color: '#fff', border: 'none', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          ➤
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-7px); }
        }
      `}</style>
    </div>
  )
}