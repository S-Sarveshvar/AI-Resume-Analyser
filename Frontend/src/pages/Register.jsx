import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export default function Register({ navigate: navigateProp, addToast }) {
  const routerNavigate = useNavigate()
  const navigate = navigateProp || routerNavigate

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const passwordMatch = form.confirm === '' || form.password === form.confirm

  const set = (k) => (e) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!passwordMatch) return

    setLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })

      let data = {}
      try {
        data = await response.json()
      } catch {
        // Fallback if response is not JSON
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed. Please try again.')
      }

      const token = data.token || data.jwtToken || data.accessToken
      if (token) {
        localStorage.setItem('token', token)
      }
      const userData = data.user || { name: form.name, email: form.email }
      localStorage.setItem('user', JSON.stringify(userData))

      if (typeof addToast === 'function') {
        addToast('success', data.message || 'Account created! Welcome to ResumeAI.')
      }

      navigate('/analysis/new')
    } catch (error) {
      const msg = error.message || 'Unable to register. Please try again.'
      setErrorMessage(msg)
      if (typeof addToast === 'function') {
        addToast('error', msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <nav className="register-nav">
        <Link to="/" className="register-brand">
          <span className="register-brand-icon">
            <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
              <path d="M2 2h11v2H2V2zm0 4h7v2H2V6zm0 4h9v2H2v-2z" fill="white"/>
            </svg>
          </span>
          ResumeAI
        </Link>
      </nav>

      <div className="register-content">
        <div className="register-wrapper">
          <div className="register-card">
            <div className="register-header">
              <h1>Create your ResumeAI account</h1>
              <p>Start analyzing your resume and landing more interviews.</p>
            </div>

            {errorMessage && (
              <div className="register-error">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Alex Johnson"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    placeholder="Min. 8 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="password-toggle"
                  >
                    <EyeIcon show={showPass} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  placeholder="Repeat your password"
                  required
                  className={!passwordMatch ? 'input-error' : ''}
                />
                {!passwordMatch && <p className="error-text">Passwords do not match.</p>}
              </div>

              <button
                type="submit"
                disabled={loading || !passwordMatch}
                className="register-submit"
              >
                {loading && <span className="register-spinner" />}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="register-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="login-link">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EyeIcon({ show }) {
  return show ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}