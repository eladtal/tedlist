import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { API_BASE_URL } from '../config'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      })

      if (response.data.token) {
        login(response.data.token, response.data.user)
        toast.success('Login successful!')
        navigate('/')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#f0f7ff] to-[#eef2ff] flex justify-center">
      <div className="w-full max-w-2xl mt-24 mb-10 px-6">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 rounded-[2.5rem] border border-[#dbeafe] shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#b197fc] to-[#7950f2]">
                Welcome Back
              </span>
            </h2>
            <p className="text-gray-600">
              Sign in to your <span className="text-[#b197fc]">Ted</span><span className="text-[#69db7c]">l</span><span className="text-[#ffa8a8]">ist</span> account
            </p>
            <p className="mt-3 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-[#7950f2] hover:text-[#845ef7]">
                Create one now
              </Link>
            </p>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-[#dbeafe] bg-white/80 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#b197fc] focus:border-[#b197fc] focus:ring-2 transition-all sm:text-sm"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-[#7950f2] hover:text-[#845ef7]">
                  Forgot?
                </Link>
              </div>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-[#dbeafe] bg-white/80 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#b197fc] focus:border-[#b197fc] focus:ring-2 transition-all sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-white bg-gradient-to-r from-[#b197fc] to-[#7950f2] hover:from-[#9775fa] hover:to-[#6741d9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7950f2] font-medium transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 