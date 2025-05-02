import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import { Bars3Icon, XMarkIcon, UserIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import NotificationPanel from './NotificationPanel'
import { Menu } from '@headlessui/react'

const Layout: React.FC = () => {
  const { user, logout } = useAuthStore()
  const { connectWebSocket, disconnectWebSocket, fetchNotifications } = useNotificationStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      console.log('Initializing notifications for user:', user._id);
      connectWebSocket();
      fetchNotifications();
      return () => {
        disconnectWebSocket();
      };
    }
  }, [user]);

  const navigation = user ? [
    { name: 'Submit Item', href: '/submit' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'My Deals', href: '/my-deals' }
  ] : [];

  const handleLogout = async () => {
    try {
      disconnectWebSocket();
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="text-xl sm:text-2xl font-bold text-primary-600">
                  Tedlist
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                      location.pathname === item.href
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <NotificationPanel />
                  <div className="flex items-center">
                    <Menu as="div" className="relative">
                      <Menu.Button className="flex items-center space-x-3 rounded-full py-1.5 px-2 hover:bg-gray-50 transition-colors">
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&bold=true`}
                          alt={user.name}
                          className="h-8 w-8 rounded-full ring-2 ring-white"
                        />
                        <div className="hidden sm:flex items-center">
                          <span className="text-sm font-medium text-gray-700">{user.name}</span>
                          <svg className="ml-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } flex items-center px-4 py-2 text-sm text-gray-700`}
                            >
                              <UserIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        {user.isAdmin && (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/admin-panel"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } flex items-center px-4 py-2 text-sm text-gray-700`}
                              >
                                <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Admin Panel
                              </Link>
                            )}
                          </Menu.Item>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                            >
                              <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center sm:hidden">
              {user && <NotificationPanel />}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block border-l-4 py-3 pl-3 pr-4 text-base font-medium ${
                  location.pathname === item.href
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          {user ? (
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="flex items-center px-4 py-3">
                <div className="flex-shrink-0">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&bold=true`}
                    alt={user.name}
                    className="h-10 w-10 rounded-full ring-2 ring-white"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin-panel"
                    className="block px-4 py-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-3 text-left text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-200 pb-3 pt-4 px-4 space-y-3">
              <Link
                to="/login"
                className="block w-full text-center py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block w-full text-center py-2 text-base font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout 