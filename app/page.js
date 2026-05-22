'use client'
import { useState } from 'react'
import { supabase } from './lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  async function handleAuth() {
    if (!email || !password) {
      setError('Please enter your email and password')
      return
    }
    if (!email.includes('@univen.ac.za')) {
      setError('Only @univen.ac.za email addresses are allowed')
      return
    }
    setLoading(true)
    setError('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        window.location.href = '/home'
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Wrong email or password. Try again or create an account.')
      } else {
        window.location.href = '/home'
      }
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1B5E20', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, sans-serif' }}>

      <div style={{ width: '72px', height: '72px', backgroundColor: '#F9A825', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '36px' }}>🛍️</div>

      <h1 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: '700', textAlign: 'center', margin: '0 0 6px' }}>
        UNIVEN Student<br />Buy &amp; Sell
      </h1>
      <p style={{ color: '#A5D6A7', fontSize: '14px', textAlign: 'center', margin: '0 0 36px' }}>University of Venda</p>

      {error && (
        <div style={{ backgroundColor: '#FCEBEB', border: '1px solid #E57373', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', width: '100%', maxWidth: '400px' }}>
          <p style={{ color: '#A32D2D', fontSize: '13px', margin: 0 }}>⚠️ {error}</p>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
        <div>
          <label style={{ color: '#A5D6A7', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Student Email</label>
          <input type="email" placeholder="s12345678@univen.ac.za" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ color: '#A5D6A7', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Password</label>
          <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={handleAuth} disabled={loading}
          style={{ width: '100%', padding: '16px', backgroundColor: loading ? '#F0C040' : '#F9A825', color: '#1B5E20', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
          {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Log in'}
        </button>
        <button onClick={() => { setIsSignUp(!isSignUp); setError('') }}
          style={{ width: '100%', padding: '15px', backgroundColor: 'transparent', color: '#FFFFFF', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '10px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
          {isSignUp ? 'Already have an account? Log in' : 'New student? Create account'}
        </button>
      </div>

      <p style={{ color: '#A5D6A7', fontSize: '12px', textAlign: 'center', marginTop: '24px' }}>
        Only for registered UNIVEN students
      </p>
    </div>
  )
}