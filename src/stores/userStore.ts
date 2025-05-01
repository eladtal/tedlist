import { create } from 'zustand'

interface UserStore {
  teddies: number
  badges: string[]
  streak: number
  lastLoginDate: string | null
  onboardingProgress: number
  addTeddies: (amount: number) => void
  addBadge: (badge: string) => void
  updateStreak: () => void
  updateOnboardingProgress: (step: number) => void
}

export const useUserStore = create<UserStore>((set) => ({
  teddies: 0,
  badges: [],
  streak: 0,
  lastLoginDate: null,
  onboardingProgress: 0,
  
  addTeddies: (amount) => set((state) => ({ teddies: state.teddies + amount })),
  
  addBadge: (badge) => set((state) => ({ 
    badges: [...state.badges, badge],
    teddies: state.teddies + 100 // Award 100 Teddies for each new badge
  })),
  
  updateStreak: () => {
    const today = new Date().toISOString().split('T')[0]
    set((state) => {
      if (!state.lastLoginDate) {
        return { streak: 1, lastLoginDate: today }
      }
      
      const lastLogin = new Date(state.lastLoginDate)
      const currentDate = new Date(today)
      const diffTime = Math.abs(currentDate.getTime() - lastLogin.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        // Consecutive day
        const newStreak = state.streak + 1
        let bonusTeddies = 0
        
        if (newStreak === 1) bonusTeddies = 100
        else if (newStreak === 2) bonusTeddies = 150
        else if (newStreak === 5) {
          bonusTeddies = 500
          // Add streak badge if not already present
          if (!state.badges.includes('streak_master')) {
            return { 
              streak: newStreak, 
              lastLoginDate: today,
              badges: [...state.badges, 'streak_master'],
              teddies: state.teddies + bonusTeddies
            }
          }
        }
        
        return { 
          streak: newStreak, 
          lastLoginDate: today,
          teddies: state.teddies + bonusTeddies
        }
      } else if (diffDays > 1) {
        // Streak broken
        return { streak: 1, lastLoginDate: today }
      }
      
      return state
    })
  },
  
  updateOnboardingProgress: (step) => set((state) => {
    const progress = Math.min(step * 33, 100) // Each step is 33% progress
    if (progress === 100 && !state.badges.includes('starter')) {
      return { 
        onboardingProgress: progress,
        badges: [...state.badges, 'starter'],
        teddies: state.teddies + 500 // Award 500 Teddies for completing onboarding
      }
    }
    return { onboardingProgress: progress }
  })
})) 