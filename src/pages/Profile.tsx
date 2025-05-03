import React, { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { API_BASE_URL } from '../config'

interface FormData {
  name: string
  email: string
  avatar: string
}

export default function Profile() {
  const { user, login } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`
          }
        }
      )

      if (response.data.user) {
        login(useAuthStore.getState().token!, response.data.user)
        toast.success('Profile updated successfully!')
        setIsEditing(false)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#f0f7ff] to-[#eef2ff] flex justify-center">
      <div className="w-full max-w-2xl mt-24 mb-10 px-6">
        <h1 className="text-2xl font-semibold text-center mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#b197fc] to-[#7950f2]">
            Your Profile
          </span>
        </h1>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 rounded-[2.5rem] border border-[#dbeafe] shadow-xl p-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-[#dbeafe] bg-white/80 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#b197fc] focus:border-[#b197fc] focus:ring-2 transition-all sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-[#dbeafe] bg-white/80 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#b197fc] focus:border-[#b197fc] focus:ring-2 transition-all sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                name="avatar"
                id="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-[#dbeafe] bg-white/80 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#b197fc] focus:border-[#b197fc] focus:ring-2 transition-all sm:text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-[#dbeafe] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm bg-gradient-to-r from-[#b197fc] to-[#7950f2] hover:from-[#9775fa] hover:to-[#6741d9] transition-all"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 bg-white/80 rounded-[2.5rem] border border-[#dbeafe] shadow-xl p-8">
            <div className="text-center">
              <p className="max-w-2xl text-sm text-gray-500 mx-auto">
                Your personal details and preferences
              </p>
            </div>

            <div className="bg-white/80 rounded-xl shadow-sm p-6">
              <dl className="divide-y divide-gray-100">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-700">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user?.name}
                  </dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-700">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user?.email}
                  </dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-700">Avatar</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover border-2 border-[#dbeafe]"
                      />
                    ) : (
                      'No avatar set'
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm bg-gradient-to-r from-[#b197fc] to-[#7950f2] hover:from-[#9775fa] hover:to-[#6741d9] transition-all"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 