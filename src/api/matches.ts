import { API_BASE_URL } from '../config'

export interface Match {
  id: string
  itemId: string
  matchedUserId: string
  matchedItemId: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

export const createMatch = async (itemId: string, matchedItemId: string): Promise<Match> => {
  const response = await fetch(`${API_BASE_URL}/matches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ itemId, matchedItemId })
  })

  if (!response.ok) {
    throw new Error('Failed to create match')
  }

  return response.json()
}

export const acceptMatch = async (matchId: string): Promise<Match> => {
  const response = await fetch(`${API_BASE_URL}/matches/${matchId}/accept`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to accept match')
  }

  return response.json()
}

export const rejectMatch = async (matchId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/matches/${matchId}/reject`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to reject match')
  }
}

export const getMatches = async (): Promise<Match[]> => {
  const response = await fetch(`${API_BASE_URL}/matches`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch matches')
  }

  return response.json()
} 