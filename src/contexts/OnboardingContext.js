import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { usePoints } from './PointsContext';

// Define the onboarding steps
export const ONBOARDING_STEPS = {
  SIGNED_UP: 'signed_up',
  UPLOAD_ITEM: 'upload_item',
  COMPLETE_PROFILE: 'complete_profile',
  SEND_MESSAGE: 'send_message',
  SWIPE_ITEMS: 'swipe_items',
  INVITE_FRIEND: 'invite_friend'
};

// Point values for each step
export const STEP_POINTS = {
  [ONBOARDING_STEPS.SIGNED_UP]: 200,
  [ONBOARDING_STEPS.UPLOAD_ITEM]: 300,
  [ONBOARDING_STEPS.COMPLETE_PROFILE]: 250,
  [ONBOARDING_STEPS.SEND_MESSAGE]: 150,
  [ONBOARDING_STEPS.SWIPE_ITEMS]: 200,
  [ONBOARDING_STEPS.INVITE_FRIEND]: 500,
  COMPLETION_BONUS: 1000
};

// Number of items to swipe to complete that step
export const SWIPE_THRESHOLD = 5;

// Create the onboarding context
export const OnboardingContext = createContext();

// Custom hook to use the onboarding context
export const useOnboarding = () => {
  return useContext(OnboardingContext);
};

// Provider component
export const OnboardingProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { awardPoints } = usePoints();
  const [completedSteps, setCompletedSteps] = useState({});
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [swipeCount, setSwipeCount] = useState(0);

  // Load onboarding progress when user logs in
  useEffect(() => {
    if (currentUser) {
      loadOnboardingProgress();
    } else {
      setCompletedSteps({});
      setLoading(false);
    }
  }, [currentUser]);

  // Check if all steps are completed and show the completion modal if needed
  useEffect(() => {
    if (!loading && isOnboardingComplete() && !completedSteps.all_completed) {
      setShowCompletionModal(true);
      
      // Mark all steps as completed and award bonus points
      if (!completedSteps.all_completed) {
        completeAllSteps();
      }
    }
  }, [completedSteps, loading]);

  // Load onboarding progress from localStorage
  const loadOnboardingProgress = () => {
    try {
      setLoading(true);
      const savedProgress = localStorage.getItem(`tedlistOnboarding_${currentUser.id}`);
      
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setCompletedSteps(progress);
        
        // Load swipe count if it exists
        if (progress.swipe_count) {
          setSwipeCount(progress.swipe_count);
        }
      } else {
        // If no saved progress, at least mark the signed up step as completed
        const initialProgress = {
          [ONBOARDING_STEPS.SIGNED_UP]: true
        };
        setCompletedSteps(initialProgress);
        saveOnboardingProgress(initialProgress);
        
        // Award points for signing up
        awardPoints(STEP_POINTS[ONBOARDING_STEPS.SIGNED_UP], 'Signed up to Tedlist');
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save onboarding progress to localStorage
  const saveOnboardingProgress = (progress) => {
    try {
      localStorage.setItem(`tedlistOnboarding_${currentUser.id}`, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
    }
  };

  // Complete a specific step
  const completeStep = (step) => {
    if (completedSteps[step]) return false; // Step already completed
    
    const newCompletedSteps = {
      ...completedSteps,
      [step]: true
    };
    
    // Special case for swipe items
    if (step === ONBOARDING_STEPS.SWIPE_ITEMS) {
      newCompletedSteps.swipe_count = SWIPE_THRESHOLD;
    }
    
    setCompletedSteps(newCompletedSteps);
    saveOnboardingProgress(newCompletedSteps);
    
    // Award points for completing this step
    awardPoints(STEP_POINTS[step], `Completed onboarding step: ${getStepTitle(step)}`);
    
    return true;
  };

  // Mark all steps as completed and award bonus
  const completeAllSteps = () => {
    const newCompletedSteps = {
      ...completedSteps,
      [ONBOARDING_STEPS.SIGNED_UP]: true,
      [ONBOARDING_STEPS.UPLOAD_ITEM]: true,
      [ONBOARDING_STEPS.COMPLETE_PROFILE]: true,
      [ONBOARDING_STEPS.SEND_MESSAGE]: true,
      [ONBOARDING_STEPS.SWIPE_ITEMS]: true,
      [ONBOARDING_STEPS.INVITE_FRIEND]: true,
      all_completed: true
    };
    
    setCompletedSteps(newCompletedSteps);
    saveOnboardingProgress(newCompletedSteps);
    
    // Award bonus points
    awardPoints(STEP_POINTS.COMPLETION_BONUS, 'Completed Tedlist Starter Pack! 🎉');
  };

  // Track item swipes
  const trackItemSwipe = () => {
    if (completedSteps[ONBOARDING_STEPS.SWIPE_ITEMS]) {
      return false; // Already completed swipe step
    }
    
    const newCount = swipeCount + 1;
    setSwipeCount(newCount);
    
    const newCompletedSteps = {
      ...completedSteps,
      swipe_count: newCount
    };
    
    // If we've reached the threshold, complete the step
    if (newCount >= SWIPE_THRESHOLD) {
      newCompletedSteps[ONBOARDING_STEPS.SWIPE_ITEMS] = true;
      awardPoints(STEP_POINTS[ONBOARDING_STEPS.SWIPE_ITEMS], `Swiped ${SWIPE_THRESHOLD} items`);
    }
    
    setCompletedSteps(newCompletedSteps);
    saveOnboardingProgress(newCompletedSteps);
    
    return newCount >= SWIPE_THRESHOLD;
  };

  // Reset the completion modal
  const closeCompletionModal = () => {
    setShowCompletionModal(false);
  };

  // Check if a step is completed
  const isStepCompleted = (step) => {
    return !!completedSteps[step];
  };

  // Check if all onboarding steps are completed
  const isOnboardingComplete = () => {
    return Object.values(ONBOARDING_STEPS).every(step => isStepCompleted(step));
  };

  // Get the progress percentage
  const getProgressPercentage = () => {
    const totalSteps = Object.keys(ONBOARDING_STEPS).length;
    const completedCount = Object.values(ONBOARDING_STEPS).filter(step => isStepCompleted(step)).length;
    return Math.round((completedCount / totalSteps) * 100);
  };

  // Get the title for a step
  const getStepTitle = (step) => {
    switch (step) {
      case ONBOARDING_STEPS.SIGNED_UP:
        return 'Signed up';
      case ONBOARDING_STEPS.UPLOAD_ITEM:
        return 'Upload your first item';
      case ONBOARDING_STEPS.COMPLETE_PROFILE:
        return 'Complete your profile';
      case ONBOARDING_STEPS.SEND_MESSAGE:
        return 'Send your first message';
      case ONBOARDING_STEPS.SWIPE_ITEMS:
        return `Swipe ${SWIPE_THRESHOLD} items`;
      case ONBOARDING_STEPS.INVITE_FRIEND:
        return 'Invite 1 friend';
      default:
        return 'Unknown step';
    }
  };

  // Get the CTA text for a step
  const getStepCta = (step) => {
    switch (step) {
      case ONBOARDING_STEPS.UPLOAD_ITEM:
        return 'Post an item';
      case ONBOARDING_STEPS.COMPLETE_PROFILE:
        return 'Edit profile';
      case ONBOARDING_STEPS.SEND_MESSAGE:
        return 'Go to chat';
      case ONBOARDING_STEPS.SWIPE_ITEMS:
        return 'Start swiping';
      case ONBOARDING_STEPS.INVITE_FRIEND:
        return 'Share invite link';
      default:
        return 'Complete';
    }
  };

  // Get the navigation path for a CTA
  const getStepCtaPath = (step) => {
    switch (step) {
      case ONBOARDING_STEPS.UPLOAD_ITEM:
        return '/upload';
      case ONBOARDING_STEPS.COMPLETE_PROFILE:
        return '/profile';
      case ONBOARDING_STEPS.SEND_MESSAGE:
        return '/messages';
      case ONBOARDING_STEPS.SWIPE_ITEMS:
        return '/swipe';
      case ONBOARDING_STEPS.INVITE_FRIEND:
        return '/profile'; // Add invite flow in profile
      default:
        return '/';
    }
  };

  // Get swipe count progress
  const getSwipeProgress = () => {
    return {
      current: swipeCount,
      target: SWIPE_THRESHOLD,
      completed: isStepCompleted(ONBOARDING_STEPS.SWIPE_ITEMS)
    };
  };

  // Value object for the context provider
  const value = {
    completedSteps,
    showCompletionModal,
    completeStep,
    closeCompletionModal,
    isStepCompleted,
    isOnboardingComplete,
    getProgressPercentage,
    getStepTitle,
    getStepCta,
    getStepCtaPath,
    trackItemSwipe,
    getSwipeProgress,
    ONBOARDING_STEPS,
    STEP_POINTS
  };

  return (
    <OnboardingContext.Provider value={value}>
      {!loading && children}
    </OnboardingContext.Provider>
  );
};
