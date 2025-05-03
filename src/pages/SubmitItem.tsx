import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { API_BASE_URL } from '../config'
import { useAuthStore } from '../stores/authStore'
import axios from 'axios'

interface FormData {
  title: string
  description: string
  condition: 'New' | 'Like New' | 'Excellent' | 'Good' | 'Fair' | 'Poor'
  images: File[]
  type: 'trade' | 'sell'
}

export default function SubmitItem() {
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    condition: 'Good',
    images: [],
    type: 'trade',
  })
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + formData.images.length > 5) {
      toast.error('You can upload a maximum of 5 images')
      return
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls(prev => [...prev, ...newPreviewUrls])
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('condition', formData.condition)
      formDataToSend.append('type', formData.type)
      
      // Append each image file
      formData.images.forEach((image) => {
        formDataToSend.append('images', image)
      })

      const response = await axios.post(
        `${API_BASE_URL}/api/items`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.status === 201) {
        toast.success('Item submitted successfully!')
        navigate('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit item')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <div className="px-6 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Submit a New Item</h1>
            <p className="mt-2 text-sm text-gray-600">
              Add details about your item to share it with others.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input"
                placeholder="What would you like to trade?"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="input"
                placeholder="Describe your item's condition, features, and what you're looking to trade it for..."
              />
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                required
                value={formData.condition}
                onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as FormData['condition'] }))}
                className="input"
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
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as FormData['type'] }))}
                className="input"
              >
                <option value="trade">Trade-In</option>
                <option value="sell">Sell</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
              <div className="mt-1 flex justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 hover:border-primary-400 transition-colors duration-200">
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500"
                    >
                      <span>Upload images</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 5MB each</p>
                </div>
              </div>
            </div>

            {previewUrls.length > 0 && (
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                {previewUrls.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {previewUrls.map((url) => (
                      <div key={url} className="relative">
                        <img
                          src={url}
                          alt="Preview"
                          className="h-24 w-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(previewUrls.indexOf(url))}
                          className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm leading-6 text-gray-600">No images uploaded</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-gradient-to-r from-primary-400 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-primary-500 hover:to-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? 'Submitting...' : 'Submit Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 