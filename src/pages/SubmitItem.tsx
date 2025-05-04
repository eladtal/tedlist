import React, { useState, useRef } from 'react'
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

const SubmitItem: React.FC = () => {
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [condition, setCondition] = useState('good')
  const [type, setType] = useState('toy')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { token } = useAuthStore()
  const { currentStep, hasUploadedFirstItem } = useOnboardingStore()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files)
    if (files.length + images.length > 5) {
      toast.error('You can upload a maximum of 5 images')
      return
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image type`)
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 10MB)`)
      }
      
      return isValidType && isValidSize
    })

    if (validFiles.length) {
      setImages(prev => [...prev, ...validFiles])
      // Create preview URLs
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file))
      setPreviewUrls(prev => [...prev, ...newPreviewUrls])
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]) // Clean up the URL
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image type`)
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 10MB)`)
      }
      
      return isValidType && isValidSize
    })

    if (validFiles.length) {
      setImages(prev => [...prev, ...validFiles])
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file))
      setPreviewUrls(prev => [...prev, ...newPreviewUrls])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit clicked', { images, title, description, condition, type });
    
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('condition', condition);
      formData.append('type', type);
      
      images.forEach((image, index) => {
        formData.append('images', image);
        console.log(`Adding image ${index}:`, image.name);
      });

      console.log('Making API request to:', `${API_BASE_URL}/api/items`);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/items`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Response received:', response.data);
      
      if (response.data) {
        setShowSuccess(true);
        toast.success('Item submitted successfully!');
        
        // Clear form after successful upload
        setTitle('');
        setDescription('');
        setCondition('good');
        setType('toy');
        setImages([]);
        setPreviewUrls([]);
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Failed to submit item');
    } finally {
      setIsLoading(false);
    }
  };

  // Show the upload prompt for first-time users
  if (currentStep === 2 && !hasUploadedFirstItem && window.location.pathname !== '/submit') {
    return <UploadPrompt />
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Submit Your Item</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (up to 5)
              </label>
              <div
                className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg"
                onDrop={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const files = Array.from(e.dataTransfer.files)
                  if (files.length + images.length > 5) {
                    toast.error('You can upload a maximum of 5 images')
                    return
                  }
                  handleFiles(files)
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <div className="space-y-4 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex flex-col items-center text-sm text-gray-600">
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.multiple = true;
                        input.accept = 'image/jpeg,image/png,image/gif';
                        input.onchange = (e) => {
                          const target = e.target as HTMLInputElement;
                          if (target.files) {
                            handleImageChange({ target } as React.ChangeEvent<HTMLInputElement>);
                          }
                        };
                        input.click();
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Choose Files
                    </button>
                    <p className="text-gray-500 mt-2">or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
              
              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rest of the form fields remain unchanged */}
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
      {/* Success Modal */}
      {showSuccess && (
        <UploadSuccess
          imageUrl={previewUrls[0]}
          onClose={() => {
            setShowSuccess(false);
          }}
        />
      )}
    </>
  )
}

export default SubmitItem 