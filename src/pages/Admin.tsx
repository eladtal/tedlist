import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  status: 'active' | 'suspended' | 'banned'
  createdAt: string
}

interface Report {
  id: string
  type: 'user' | 'item' | 'list'
  targetId: string
  reason: string
  status: 'pending' | 'resolved' | 'dismissed'
  createdAt: string
  reporter: {
    id: string
    name: string
  }
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // TODO: Fetch users and reports from API
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [usersResponse, reportsResponse] = await Promise.all([
  //         fetch('/api/admin/users'),
  //         fetch('/api/admin/reports'),
  //       ])
  //       const usersData = await usersResponse.json()
  //       const reportsData = await reportsResponse.json()
  //       setUsers(usersData)
  //       setReports(reportsData)
  //     } catch (error) {
  //       console.error('Failed to fetch admin data:', error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }
  //   fetchData()
  // }, [])

  const handleUserAction = async (userId: string, action: 'suspend' | 'ban' | 'promote') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to perform action')
      }

      const updatedUser = await response.json()
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updatedUser : user))
      )
      toast.success(`User ${action}ed successfully`)
    } catch (error) {
      toast.error('Failed to perform action. Please try again.')
    }
  }

  const handleReportAction = async (reportId: string, action: 'resolve' | 'dismiss') => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}/${action}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to perform action')
      }

      const updatedReport = await response.json()
      setReports((prev) =>
        prev.map((report) => (report.id === reportId ? updatedReport : report))
      )
      toast.success(`Report ${action}d successfully`)
    } catch (error) {
      toast.error('Failed to perform action. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center text-gray-500">Loading admin data...</div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Users Section */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Users</h3>
              <div className="mt-4 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                            Name
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Email
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                          <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {user.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {user.email}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {user.status}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <button
                                onClick={() => handleUserAction(user.id, 'suspend')}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Suspend
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'ban')}
                                className="ml-4 text-red-600 hover:text-red-900"
                              >
                                Ban
                              </button>
                              {user.role === 'user' && (
                                <button
                                  onClick={() => handleUserAction(user.id, 'promote')}
                                  className="ml-4 text-green-600 hover:text-green-900"
                                >
                                  Promote
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Section */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Reports</h3>
              <div className="mt-4 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                            Type
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Reason
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                          <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reports.map((report) => (
                          <tr key={report.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {report.type}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {report.reason}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {report.status}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <button
                                onClick={() => handleReportAction(report.id, 'resolve')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Resolve
                              </button>
                              <button
                                onClick={() => handleReportAction(report.id, 'dismiss')}
                                className="ml-4 text-red-600 hover:text-red-900"
                              >
                                Dismiss
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 