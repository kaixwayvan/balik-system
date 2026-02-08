import { useState } from 'react'
import { forgotPassword } from './services/authService'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const isMobile = (value) => /^(09|\+639)\d{9}$/.test(value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!identifier) return setError('Email or mobile number is required')
    if (!isEmail(identifier) && !isMobile(identifier)) return setError('Enter a valid email or PH mobile number')

    try {
      setLoading(true)
      const res = await forgotPassword({ identifier })
      if (res.data && res.data.success) {
        setMessage(res.data.message || 'If an account exists, a reset token was sent (dev-mode may return the token).')
        if (res.data.token) setMessage((m) => m + '\nToken: ' + res.data.token)
        setIdentifier('')
      } else {
        setError(res.data?.message || 'Request failed')
      }
    } catch (err) {
      setError(err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>

        {message && <pre className="bg-green-50 p-3 rounded mb-4 text-sm whitespace-pre-wrap">{message}</pre>}
        {error && <div className="bg-red-50 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email or mobile number</label>
            <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2 rounded">
              {loading ? 'Sending...' : 'Send reset token'}
            </button>
            <Link to="/login" className="px-4 py-2 border rounded self-center">Back</Link>
          </div>
        </form>
      </div>
    </main>
  )
}
