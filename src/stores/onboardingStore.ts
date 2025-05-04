import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  currentStep: number;
  isComplete: boolean;
  hasUploadedFirstItem: boolean;
  hasCompletedFirstSwipes: boolean;
  swipeCount: number;
  setCurrentStep: (step: number) => void;
  completeOnboarding: () => void;
  markFirstItemUploaded: () => void;
  incrementSwipeCount: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      isComplete: false,
      hasUploadedFirstItem: false,
      hasCompletedFirstSwipes: false,
      swipeCount: 0,
      setCurrentStep: (step) => set({ currentStep: step }),
      completeOnboarding: () => set({ isComplete: true }),
      markFirstItemUploaded: () => set({ hasUploadedFirstItem: true }),
      incrementSwipeCount: () => 
        set((state) => ({ 
          swipeCount: state.swipeCount + 1,
          hasCompletedFirstSwipes: state.swipeCount + 1 >= 3 
        })),
      resetOnboarding: () => set({
        currentStep: 1,
        isComplete: false,
        hasUploadedFirstItem: false,
        hasCompletedFirstSwipes: false,
        swipeCount: 0
      })
    }),
    {
      name: 'onboarding-storage'
    }
  )
); 