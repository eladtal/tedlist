import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { usePoints } from './PointsContext';

// Onboarding step definitions
export const ONBOARDING_STEPS = {
  SIGN_UP: 'sign_up',
  UPLOAD_ITEM: 'upload_item',
  COMPLETE_PROFILE: 'complete_profile',
  SEND_MESSAGE: 'send_message',
  SWIPE_ITEMS: 'swipe_items',
  INVITE_FRIEND: 'invite_friend'
};

// Points awarded for each step
export const STEP_POINTS = {
  SIGN_UP: 200,
  UPLOAD_ITEM: 300,
  COMPLETE_PROFILE: 250,
  SEND_MESSAGE: 150,
  SWIPE_ITEMS: 200,
  INVITE_FRIEND: 500,
  COMPLETION_BONUS: 1000
};

export const ONBOARDING_STEP_DETAILS = {
  [ONBOARDING_STEPS.SIGN_UP]: {
    title: 'Create an account',
    description: 'Sign up to start your Tedlist journey',
    points: STEP_POINTS.SIGN_UP,
    icon: 'FaUserPlus',
    ctaText: 'Sign Up',
    ctaPath: '/signup'
  },
  [ONBOARDING_STEPS.UPLOAD_ITEM]: {
    title: 'Upload your first item',
    description: 'Share something you want to sell or trade',
    points: STEP_POINTS.UPLOAD_ITEM,
    icon: 'FaUpload',
    ctaText: 'Upload Item',
    ctaPath: '/upload'
  },
  [ONBOARDING_STEPS.COMPLETE_PROFILE]: {
    title: 'Complete your profile',
    description: 'Add your information to build trust with other users',
    points: STEP_POINTS.COMPLETE_PROFILE,
    icon: 'FaUser',
    ctaText: 'Edit Profile',
    ctaPath: '/profile'
  },
  [ONBOARDING_STEPS.SEND_MESSAGE]: {
    title: 'Send your first message',
    description: 'Start a conversation with another user',
    points: STEP_POINTS.SEND_MESSAGE,
    icon: 'FaComments',
    ctaText: 'Messages',
    ctaPath: '/messages'
  },
  [ONBOARDING_STEPS.SWIPE_ITEMS]: {
    title: 'Swipe on 5 items',
    description: 'Discover items by swiping through the marketplace',
    points: STEP_POINTS.SWIPE_ITEMS,
    icon: 'FaExchangeAlt',
    ctaText: 'Discover Items',
    ctaPath: '/swipe'
  },
  [ONBOARDING_STEPS.INVITE_FRIEND]: {
    title: 'Invite a friend',
    description: 'Grow your community by inviting friends',
    points: STEP_POINTS.INVITE_FRIEND,
    icon: 'FaUserFriends',
    ctaText: 'Invite Friends',
    ctaPath: '/profile'
  }
};

// Create the context
const OnboardingContext = createContext();

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = 'test';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Provider component
export const OnboardingProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { awardPoints } = usePoints();
  const [completedSteps, setCompletedSteps] = useState({});
  const [swipeCount, setSwipeCount] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const localStorageAvailable = isLocalStorageAvailable();
  
  // Load saved onboarding progress
  useEffect(() => {
    if (!currentUser || !localStorageAvailable) return;
    
    try {
      const savedProgress = localStorage.getItem(`tedlist_onboarding_${currentUser.id}`);
      
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        setCompletedSteps(parsedProgress.completedSteps || {});
        setSwipeCount(parsedProgress.swipeCount || 0);
      } else {
        // If no saved progress, mark sign up as complete automatically
        completeStep(ONBOARDING_STEPS.SIGN_UP);
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
      // Initialize with empty state
      setCompletedSteps({});
      setSwipeCount(0);
    }
  }, [currentUser]);
  
  // Save progress whenever it changes
  useEffect(() => {
    if (!currentUser || !localStorageAvailable) return;
    
    try {
      localStorage.setItem(
        `tedlist_onboarding_${currentUser.id}`,
        JSON.stringify({
          completedSteps,
          swipeCount
        })
      );
      
      // Check if all steps are completed
      const allStepsCompleted = Object.values(ONBOARDING_STEPS).every(
        step => completedSteps[step]
      );
      
      if (allStepsCompleted && !completedSteps.bonusAwarded) {
        // Award completion bonus
        awardPoints(STEP_POINTS.COMPLETION_BONUS, 'Completed all onboarding steps');
        setCompletedSteps(prev => ({
          ...prev,
          bonusAwarded: true
        }));
        setShowCompletionModal(true);
      }
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
    }
  }, [completedSteps, swipeCount, currentUser]);
  
  // Mark a step as completed
  const completeStep = (step) => {
    if (!currentUser) return;
    
    // Check if step is already completed
    if (completedSteps[step]) return;
    
    // Mark step as completed
    setCompletedSteps(prev => ({
      ...prev,
      [step]: true
    }));
    
    // Award points for completing the step
    if (STEP_POINTS[step]) {
      const stepTitle = ONBOARDING_STEP_DETAILS[step]?.title || step;
      awardPoints(STEP_POINTS[step], `Completed onboarding step: ${stepTitle}`);
    }
  };
  
  // Track swipe count for the swipe items step
  const trackSwipe = () => {
    if (!currentUser) return;
    
    const newSwipeCount = swipeCount + 1;
    setSwipeCount(newSwipeCount);
    
    // Check if user has swiped enough for the step
    if (newSwipeCount >= 5 && !completedSteps[ONBOARDING_STEPS.SWIPE_ITEMS]) {
      completeStep(ONBOARDING_STEPS.SWIPE_ITEMS);
    }
  };
  
  // Check if a step is completed
  const isStepCompleted = (step) => {
    return !!completedSteps[step];
  };
  
  // Calculate the percentage of completed steps
  const getProgressPercentage = () => {
    if (!currentUser) return 0;
    
    const totalSteps = Object.keys(ONBOARDING_STEPS).length;
    const completedCount = Object.values(ONBOARDING_STEPS).filter(
      step => completedSteps[step]
    ).length;
    
    return Math.round((completedCount / totalSteps) * 100);
  };
  
  // Get total points that have been earned through onboarding
  const getTotalPointsEarned = () => {
    if (!currentUser) return 0;
    
    let total = 0;
    
    // Add up points from completed steps
    Object.values(ONBOARDING_STEPS).forEach(step => {
      if (completedSteps[step]) {
        total += STEP_POINTS[step] || 0;
      }
    });
    
    // Add completion bonus if awarded
    if (completedSteps.bonusAwarded) {
      total += STEP_POINTS.COMPLETION_BONUS;
    }
    
    return total;
  };
  
  // Close the completion modal
  const closeCompletionModal = () => {
    setShowCompletionModal(false);
  };
  
  return (
    <OnboardingContext.Provider
      value={{
        completedSteps,
        completeStep,
        isStepCompleted,
        getProgressPercentage,
        swipeCount,
        trackSwipe,
        showCompletionModal,
        closeCompletionModal,
        getTotalPointsEarned
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

// Custom hook to use the onboarding context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    console.error('useOnboarding must be used within an OnboardingProvider');
    return {
      completedSteps: {},
      completeStep: () => {},
      isStepCompleted: () => false,
      getProgressPercentage: () => 0,
      swipeCount: 0,
      trackSwipe: () => {},
      showCompletionModal: false,
      closeCompletionModal: () => {},
      getTotalPointsEarned: () => 0
    };
  }
  return context;
};
