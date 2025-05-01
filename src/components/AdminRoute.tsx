import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

interface AdminRouteProps {
  children: React.ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user || !user.isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <>{children}</>
} 