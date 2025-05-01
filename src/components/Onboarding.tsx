import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TeddyBalance from './TeddyBalance'
import axios from 'axios'

interface OnboardingProps {
  onComplete: () => void
}

const OnboardingSteps = {
  WELCOME: 'welcome',
  UPLOAD_ITEM: 'upload_item',
  PROFILE: 'profile',
  SWIPE_INTRO: 'swipe_intro',
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(OnboardingSteps.WELCOME)
  const [teddies, setTeddies] = useState(0)
  const [showTeddyAnimation, setShowTeddyAnimation] = useState(false)

  const awardTeddies = async (amount: number) => {
    try {
      const response = await axios.post('/api/rewards/teddies', { amount })
      setTeddies(response.data.teddies)
      setShowTeddyAnimation(true)
      setTimeout(() => setShowTeddyAnimation(false), 3000)
    } catch (error) {
      console.error('Error awarding teddies:', error)
    }
  }

  const updateOnboardingProgress = async (step: number) => {
    try {
      await axios.post('/api/rewards/onboarding', { step })
    } catch (error) {
      console.error('Error updating onboarding progress:', error)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case OnboardingSteps.WELCOME:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-6">🎉 Welcome to Tedlist!</h1>
            <p className="text-xl text-gray-600 mb-8">Let's get you trading!</p>
            <button
              onClick={() => setCurrentStep(OnboardingSteps.UPLOAD_ITEM)}
              className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition-colors"
            >
              Let's Begin
            </button>
          </motion.div>
        )

      case OnboardingSteps.UPLOAD_ITEM:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md mx-auto"
          >
            <h2 className="text-2xl font-semibold mb-6">Upload Your First Item</h2>
            {/* Add your item upload form here */}
            <button
              onClick={async () => {
                await awardTeddies(100)
                await updateOnboardingProgress(1)
                setCurrentStep(OnboardingSteps.PROFILE)
              }}
              className="bg-pink-500 text-white px-6 py-2 rounded-full mt-4"
            >
              Complete Upload
            </button>
          </motion.div>
        )

      case OnboardingSteps.PROFILE:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md mx-auto"
          >
            <h2 className="text-2xl font-semibold mb-6">Personalize Your Profile</h2>
            {/* Add your profile customization form here */}
            <button
              onClick={async () => {
                await awardTeddies(50)
                await updateOnboardingProgress(2)
                setCurrentStep(OnboardingSteps.SWIPE_INTRO)
              }}
              className="bg-pink-500 text-white px-6 py-2 rounded-full mt-4"
            >
              Save Profile
            </button>
          </motion.div>
        )

      case OnboardingSteps.SWIPE_INTRO:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl font-semibold mb-6">Let's find you a match!</h2>
            <p className="text-gray-600 mb-8">
              Start swiping to discover items and earn Teddies!
            </p>
            <button
              onClick={async () => {
                await updateOnboardingProgress(3)
                onComplete()
              }}
              className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition-colors"
            >
              Start Swiping
            </button>
          </motion.div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="absolute top-4 right-4">
        <TeddyBalance balance={teddies} showAnimation={showTeddyAnimation} />
      </div>
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  )
}

export default Onboarding 