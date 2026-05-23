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
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const typingTimeout = useRef(null)
  const listingIdRef = useRef(null)

  useEffect(() => { setup() }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  async function setup() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/'; return }
    setUser(user)

    const params = new URLSearchParams(window.location.search)
    const listingId = params.get('listing_id')
    const receiver = params.get('receiver')
    listingIdRef.current = listingId
    setReceiverEmail(receiver)

    if (listingId) {
      const { data } = await supabase.from('listings').select('*').eq('id', listingId).single()
      setListing(data)
      await fetchMessages(listingId, user.email, receiver)
    }

    setLoading(false)

    supabase.channel('messages-' + listingId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `listing_id=eq.${listingId}` },
        payload => setMessages(prev => [...prev, payload.new]))
      .subscribe()

    supabase.channel('typing-' + listingId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'typing', filter: `listing_id=eq.${listingId}` },
        payload => { if (payload.new.user_email !== user.email) setIsTyping(payload.new.is_typing) })
      .subscribe()
  }

  async function fetchMessages(listingId, myEmail, otherEmail) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('listing_id', listingId)
      .or(`and(sender_email.eq.${myEmail},receiver_email.eq.${otherEmail}),and(sender_email.eq.${otherEmail},receiver_email.eq.${myEmail})`)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  async function handleTyping(e) {
    setNewMessage(e.target.value)
    if (!user || !listingIdRef.current) return
    await supabase.from('typing').upsert({ listing_id: parseInt(listingIdRef.current), user_email: user.email, is_typing: true, updated_at: new Date().toISOString() }, { onConflict: 'listing_id,user_email' })
    clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(async () => {
      await supabase.from('typing').upsert({ listing_id: parseInt(listingIdRef.current), user_email: user.email, is_typing: false, updated_at: new Date().toISOString() }, { onConflict: 'listing_id,user_email' })
    }, 2000)
  }

  async function sendMessage() {
    if (!newMessage.trim()) return
    const messageText = newMessage
    setNewMessage('')

    const { data, error } = await supabase
      .from('messages')
      .insert({ listing_id: Number(listingIdRef.current), sender_email: user.email, receiver_email: receiverEmail, message: messageText })
      .select()

    if (error) {
      alert('Failed to send: ' + error.message)
      setNewMessage(messageText)
      return
    }

    setMessages(prev => [...prev, data[0]])

    await supabase.from('typing').upsert({ listing_id: parseInt(listingIdRef.current), user_email: user.email, is_typing: false, updated_at: new Date().toISOString() }, { onConflict: 'listing_id,user_email' })
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#1B5E20', fontSize: '32px' }}>⏳</div>
  )

  return (
    <div style={{ height: '100vh', backgroundColor: '#F5F7F2', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#1B5E20', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <span onClick={() => window.history.back()} style={{ fontSize: '22px', color: '#A5D6A7', cursor: 'pointer' }}>←</span>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F9A825', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#1B5E20', flexShrink: 0 }}>
          {receiverEmail?.substring(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', margin: '0 0 1px' }}>{receiverEmail}</p>
          <p style={{ color: '#A5D6A7', fontSize: '11px', margin: 0 }}>{isTyping ? '✍️ typing...' : listing?.title}</p>
        </div>
      </div>

      {/* Listing Bar */}
      {listing && (
        <div style={{ backgroundColor: '#E8F5E9', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #C8E6C9', flexShrink: 0 }}>
          <span style={{ fontSize: '20px' }}>{listing.emoji || '📦'}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 1px' }}>{listing.title}</p>
            <p style={{ fontSize: '11px', color: '#1B5E20', fontWeight: '500', margin: 0 }}>R{listing.price}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888780' }}>
            <p style={{ fontSize: '40px', margin: '0 0 12px' }}>👋</p>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 6px' }}>Start the conversation</p>
            <p style={{ fontSize: '12px', margin: 0 }}>Ask about the listing or make an offer</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.sender_email === user?.email
          const prevMsg = messages[i - 1]
          const showTime = !prevMsg || new Date(msg.created_at) - new Date(prevMsg.created_at) > 300000
          return (
            <div key={i}>
              {showTime && (
                <div style={{ textAlign: 'center', margin: '8px 0' }}>
                  <span style={{ fontSize: '11px', color: '#888780', backgroundColor: '#E8E8E8', padding: '2px 10px', borderRadius: '10px' }}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '78%', padding: '10px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', backgroundColor: isMe ? '#1B5E20' : '#FFFFFF', border: isMe ? 'none' : '1px solid #E0E0E0', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
                  <p style={{ fontSize: '14px', color: isMe ? '#FFFFFF' : '#2C2C2A', margin: 0, wordBreak: 'break-word', lineHeight: '1.5' }}>{msg.message}</p>
                  {isMe && <p style={{ fontSize: '10px', color: '#A5D6A7', margin: '4px 0 0', textAlign: 'right' }}>✓✓</p>}
                </div>
              </div>
            </div>
          )
        })}

        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#888780', display: 'inline-block', animation: 'bounce 1s infinite' }}></span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#888780', display: 'inline-block', animation: 'bounce 1s infinite 0.2s' }}></span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#888780', display: 'inline-block', animation: 'bounce 1s infinite 0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E0E0E0', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
        <input type="text" placeholder="Type a message..." value={newMessage} onChange={handleTyping}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid #E0E0E0', fontSize: '14px', outline: 'none', backgroundColor: '#F5F7F2', fontFamily: 'Inter, sans-serif' }} />
        <button onClick={sendMessage}
          style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: newMessage.trim() ? '#1B5E20' : '#C8E6C9', color: '#FFFFFF', border: 'none', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          ➤
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}