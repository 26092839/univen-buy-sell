'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SellPage() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Books')
  const [condition, setCondition] = useState('Good')
  const [meetup, setMeetup] = useState('')
const [image, setImage] = useState(null)
const [imageUrl, setImageUrl] = useState('')

async function handleImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  const filename = `${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage.from('listing-images').upload(filename, file)
  if (!error) {
    const { data: urlData } = supabase.storage.from('listing-images').getPublicUrl(filename)
    setImageUrl(urlData.publicUrl)
    setImage(file)
  }
}
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const emojis = { Books: '📚', Electronics: '💻', Notes: '📝', Uniforms: '🥼', Other: '📦' }

  async function handlePost() {
    if (!title || !price || !description || !meetup) {
      alert('Please fill in all fields')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('listings').insert([{
      title,
      price: parseFloat(price),
      description,
      category,
      condition,
      meetup,
      emoji: emojis[category],
      image_url: imageUrl,
      seller_name: 'UNIVEN Student',
      seller_email: 'student@univen.ac.za',
      status: 'New'
    }])
    setLoading(false)
    if (error) {
      alert('Error posting listing: ' + error.message)
    } else {
      setSuccess(true)
      setTitle('')
      setPrice('')
      setDescription('')
      setMeetup('')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7F2', fontFamily: 'Inter, sans-serif', paddingBottom: '40px' }}>

      <div style={{ backgroundColor: '#1B5E20', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '22px', cursor: 'pointer', color: '#A5D6A7' }}>←</span>
        <span style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600' }}>Post a Listing</span>
        <div style={{ width: '22px' }}></div>
      </div>

      {success && (
        <div style={{ backgroundColor: '#E8F5E9', border: '1px solid #81C784', margin: '16px', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
          <p style={{ color: '#2E7D32', fontWeight: '600', margin: 0 }}>✅ Listing posted successfully!</p>
        </div>
      )}

      <div style={{ padding: '16px' }}>

        <div style={{ marginBottom: '16px' }}>
  <label style={{ display: 'block', height: '120px', backgroundColor: imageUrl ? 'transparent' : '#E8F5E9', border: '2px dashed #81C784', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
    {imageUrl
      ? <img src={imageUrl} alt="listing" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
      : <><span style={{ fontSize: '32px' }}>📷</span><span style={{ fontSize: '13px', color: '#2E7D32', marginTop: '6px', fontWeight: '500' }}>Tap to add photo</span></>
    }
    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
  </label>
</div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#888780', display: 'block', marginBottom: '6px' }}>Item title</label>
          <input type="text" placeholder="e.g. Biology Textbook 3rd Edition" value={title} onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: '13px 14px', borderRadius: '10px', border: '1px solid #C8E6C9', backgroundColor: '#FFFFFF', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#888780', display: 'block', marginBottom: '6px' }}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}
            style={{ width: '100%', padding: '13px 14px', borderRadius: '10px', border: '1px solid #C8E6C9', backgroundColor: '#FFFFFF', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
            <option>Books</option>
            <option>Electronics</option>
            <option>Notes</option>
            <option>Uniforms</option>
            <option>Other</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#888780', display: 'block', marginBottom: '6px' }}>Price (R)</label>
            <input type="number" placeholder="150" value={price} onChange={e => setPrice(e.target.value)}
              style={{ width: '100%', padding: '13px 14px', borderRadius: '10px', border: '1px solid #C8E6C9', backgroundColor: '#FFFFFF', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#888780', display: 'block', marginBottom: '6px' }}>Condition</label>
            <select value={condition} onChange={e => setCondition(e.target.value)}
              style={{ width: '100%', padding: '13px 14px', borderRadius: '10px', border: '1px solid #C8E6C9', backgroundColor: '#FFFFFF', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
              <option>New</option>
              <option>Good</option>
              <option>Fair</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#888780', display: 'block', marginBottom: '6px' }}>Description</label>
          <textarea placeholder="Describe your item — condition, edition, any damage…" value={description} onChange={e => setDescription(e.target.value)} rows={4}
            style={{ width: '100%', padding: '13px 14px', borderRadius: '10px', border: '1px solid #C8E6C9', backgroundColor: '#FFFFFF', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'none' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', color: '#888780', display: 'block', marginBottom: '6px' }}>Meetup location on campus</label>
          <input type="text" placeholder="e.g. Main Library, UNIVEN" value={meetup} onChange={e => setMeetup(e.target.value)}
            style={{ width: '100%', padding: '13px 14px', borderRadius: '10px', border: '1px solid #C8E6C9', backgroundColor: '#FFFFFF', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <button onClick={handlePost} disabled={loading}
          style={{ width: '100%', padding: '16px', backgroundColor: loading ? '#81C784' : '#1B5E20', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
          {loading ? 'Posting...' : 'Post listing'}
        </button>

      </div>
    </div>
  )
}