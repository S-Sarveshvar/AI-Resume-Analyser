import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export default function Login({ navigate: navigateProp, addToast }) {
  const routerNavigate = useNavigate()
  const navigate = navigateProp || routerNavigate

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      let data = {}
      try {
        data = await response.json()
      } catch {
        // Fallback if response is not JSON
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed. Please check your credentials.')
      }

      const token = data.token || data.jwtToken || data.accessToken
      if (token) {
        localStorage.setItem('token', token)
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      if (typeof addToast === 'function') {
        addToast('success', data.message || 'Login successful!')
      }

      navigate('/dashboard')
    } catch (error) {
      const msg = error.message || 'Unable to login. Please try again.'
      setErrorMessage(msg)
      if (typeof addToast === 'function') {
        addToast('error', msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <header className="">
        <div className="navbar-container-1">
          <Link to="/" className="navbar-logo">ResumeAI</Link>
        </div>
      </header>

      {/* Auth card */}
      <div className="login-content">
        <div className="login-wrapper">
          <div className="login-card">
            <div className="login-header">
              <h1>Welcome back</h1>
              <p>
                Continue your career journey with AI-powered resume analysis.
              </p>
            </div>

            {errorMessage && (
              <div className="login-error">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email address</label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="password">Password</label>

                  <button
                    type="button"
                    className="forgot-password"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="password-toggle"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                        <circle
                          cx="8"
                          cy="8"
                          r="1.5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M2 2l12 12"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                        <circle
                          cx="8"
                          cy="8"
                          r="1.5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="login-submit"
              >
                {loading && <span className="login-spinner" />}

                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            {/* Register */}
            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="create-account">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
