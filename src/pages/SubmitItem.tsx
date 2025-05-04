import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { API_BASE_URL } from '../config'
import { useAuthStore } from '../stores/authStore'
import { useOnboardingStore } from '../stores/onboardingStore'
import axios from 'axios'
import UploadPrompt from '../components/onboarding/UploadPrompt'
import UploadSuccess from '../components/onboarding/UploadSuccess'

interface FormData {
  title: string
  description: string
  condition: 'New' | 'Like New' | 'Excellent' | 'Good' | 'Fair' | 'Poor'
  images: File[]
  type: 'trade' | 'sell'
}

export default function SubmitItem() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [condition, setCondition] = useState<FormData['condition']>('Good')
  const [type, setType] = useState<FormData['type']>('trade')
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')
  
  const { token } = useAuthStore()
  const { currentStep, hasUploadedFirstItem } = useOnboardingStore()
  const navigate = useNavigate()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 5) {
      toast.error('You can upload a maximum of 5 images')
      return
    }

    setImages(prev => [...prev, ...files])

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls(prev => [...prev, ...newPreviewUrls])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('condition', condition)
      formData.append('type', type)
      
      images.forEach((image) => {
        formData.append('images', image)
      })

      const response = await axios.post(
        `${API_BASE_URL}/api/items`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.data) {
        // Set the first uploaded image URL for the success animation
        const uploadedImageUrl = response.data.images?.[0] || ''
        setUploadedImageUrl(uploadedImageUrl)
        setShowSuccess(true)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit item')
      setIsLoading(false)
    }
  }

  // Show the upload prompt for first-time users
  if (currentStep === 2 && !hasUploadedFirstItem) {
    return <UploadPrompt />
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Submit Your Item</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Images
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                      <span>Upload images</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {previewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                Condition
              </label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value as FormData['condition'])}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as FormData['type'])}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="trade">Trade-In</option>
                <option value="sell">Sell</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Submit Item'}
            </button>
          </form>
        </div>
      </div>
      {showSuccess && <UploadSuccess itemImage={uploadedImageUrl} />}
    </>
  )
} 