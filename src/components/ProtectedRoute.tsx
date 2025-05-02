import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useEffect } from 'react'
import { API_BASE_URL } from '../config'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, token, logout } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Token validation failed:', data);
          // Logout on any authentication error
          if (response.status === 401 || data.message === 'User not found' || data.message === 'Invalid token') {
            logout();
            return;
          }
        }
      } catch (error) {
        console.error('Token verification error:', error);
        // Logout on network errors to be safe
        logout();
      }
    };

    verifyToken();
  }, [token, logout]);

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
} 