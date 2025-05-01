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
        
        if (!response.ok) {
          const data = await response.json();
          console.error('Token validation failed:', data);
          // Only logout if it's a clear authentication error
          if (response.status === 401) {
            logout();
          }
        }
      } catch (error) {
        console.error('Token verification error:', error);
        // Don't logout on network errors or other non-auth errors
      }
    };

    verifyToken();
  }, [token, logout]);

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
} 