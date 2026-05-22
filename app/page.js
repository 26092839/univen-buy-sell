'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1B5E20',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, sans-serif'
    }}>

      {/* Logo Badge */}
      <div style={{
        width: '72px',
        height: '72px',
        backgroundColor: '#F9A825',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <span style={{ fontSize: '36px' }}>🛍️</span>
      </div>

      {/* App Title */}
      <h1 style={{
        color: '#FFFFFF',
        fontSize: '24px',
        fontWeight: '700',
        textAlign: 'center',
        margin: '0 0 6px'
      }}>
        UNIVEN Student<br />Buy &amp; Sell
      </h1>

      {/* Subtitle */}
      <p style={{
        color: '#A5D6A7',
        fontSize: '14px',
        textAlign: 'center',
        margin: '0 0 36px'
      }}>
        University of Venda
      </p>

      {/* Form Box */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        marginBottom: '24px'
      }}>

        {/* Email Field */}
        <div>
          <label style={{
            color: '#A5D6A7',
            fontSize: '12px',
            display: 'block',
            marginBottom: '6px'
          }}>
            Student Email
          </label>
          <input
            type="email"
            placeholder="s12345678@univen.ac.za"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.25)',
              backgroundColor: 'rgba(255,255,255,0.12)',
              color: '#FFFFFF',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Password Field */}
        <div>
          <label style={{
            color: '#A5D6A7',
            fontSize: '12px',
            display: 'block',
            marginBottom: '6px'
          }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.25)',
              backgroundColor: 'rgba(255,255,255,0.12)',
              color: '#FFFFFF',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Log In Button */}
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#F9A825',
            color: '#1B5E20',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Log in with UNIVEN account
        </button>

        {/* Create Account Button */}
        <button
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: 'transparent',
            color: '#FFFFFF',
            border: '1.5px solid rgba(255,255,255,0.4)',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Create account
        </button>
      </div>

      {/* Disclaimer */}
      <p style={{
        color: '#A5D6A7',
        fontSize: '12px',
        textAlign: 'center',
        marginTop: '24px'
      }}>
        Only for registered UNIVEN students
      </p>

    </div>
  )
}