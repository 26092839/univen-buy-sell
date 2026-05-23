'use client'
import { useEffect, useState } from 'react'
import { StreamChat } from 'stream-chat'
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react'
import { supabase } from '../lib/supabase'
import 'stream-chat-react/dist/css/v2/index.css'

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY

export default function ChatPage() {
  const [client, setClient] = useState(null)
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setupChat()
  }, [])

  async function setupChat() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/'; return }

    const params = new URLSearchParams(window.location.search)
    const listingId = params.get('listing_id')
    const receiverEmail = params.get('receiver')

    const userId = user.email.replace(/[@.]/g, '_')
    const receiverId = receiverEmail.replace(/[@.]/g, '_')

    const res = await fetch('/api/stream-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
    const { token } = await res.json()

    const chatClient = StreamChat.getInstance(apiKey)

    await chatClient.connectUser(
      {
        id: userId,
        name: user.email,
        image: `https://ui-avatars.com/api/?name=${userId}&background=1B5E20&color=F9A825`
      },
      token
    )

    const channelId = `listing-${listingId}-${[userId, receiverId].sort().join('-')}`

    const chatChannel = chatClient.channel('messaging', channelId, {
      name: `Listing #${listingId}`,
      members: [userId, receiverId]
    })

    await chatChannel.watch()

    setClient(chatClient)
    setChannel(chatChannel)
    setLoading(false)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#1B5E20' }}>
      <div style={{ textAlign: 'center', color: '#FFFFFF' }}>
        <p style={{ fontSize: '40px', margin: '0 0 16px' }}>💬</p>
        <p style={{ fontSize: '16px', fontWeight: '600' }}>Loading chat...</p>
      </div>
    </div>
  )

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ backgroundColor: '#1B5E20', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span onClick={() => window.history.back()} style={{ fontSize: '22px', color: '#A5D6A7', cursor: 'pointer' }}>←</span>
        <span style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '600' }}>UNIVEN Buy & Sell Chat</span>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Chat client={client} theme="messaging light">
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  )
}