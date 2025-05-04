import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Menu } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, UserIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import NotificationPanel from './NotificationPanel'

const Layout: React.FC = () => {
  const { user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = user ? [
    { name: 'Submit Item', href: '/submit' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'My Deals', href: '/my-deals' }
  ] : [];

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  // Don't render the header if we're on one of these paths
  const hideHeaderPaths = [
    '/login',
    '/register'
  ];
  
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#f0f7ff] to-[#eef2ff]">
      {shouldShowHeader && (
        <div className="sticky top-5 z-50 flex justify-center w-full">
          <div className="max-w-2xl w-full mx-auto bg-gradient-to-r from-[#e8f4fd] to-[#e0f9ec] border border-[#cae1f7] rounded-2xl shadow-md py-3 px-6">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center">
                  <div className="flex items-center">
                    <img 
                      src="/tedlist-logo1.png" 
                      alt="Tedlist Logo" 
                      className="h-16 w-auto" 
                    />
                    <span className="text-2xl font-bold -ml-2">
                      <span className="text-[#b197fc]">Ted</span>
                      <span className="text-[#69db7c]">l</span>
                      <span className="text-[#ffa8a8]">ist</span>
                    </span>
                  </div>
                </Link>
              </div>
              
              <div className="flex-grow"></div>
              
              {user && (
                <div className="hidden md:flex items-center space-x-8">
                  {navigation.map((navItem) => (
                    <Link
                      key={navItem.name}
                      to={navItem.href}
                      className={`whitespace-nowrap relative px-2 py-1 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-white/50 group ${
                        location.pathname === navItem.href
                          ? 'text-[#69db7c]'
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      {navItem.name}
                      {location.pathname === navItem.href && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#69db7c] rounded-full"></span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <NotificationPanel />
                    <Menu as="div" className="relative">
                      <Menu.Button className="flex items-center space-x-2 rounded-full py-1.5 px-3 bg-white/50 hover:bg-white/80 transition-colors border border-gray-100 shadow-sm">
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&bold=true`}
                          alt={user.name}
                          className="h-8 w-8 rounded-full ring-1 ring-white/70"
                        />
                        <div className="hidden sm:flex items-center">
                          <span className="text-sm font-medium text-gray-700">{user.name}</span>
                          <svg className="ml-1.5 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                                to="/admin"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
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
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="rounded-xl bg-gradient-to-r from-[#69db7c] to-[#56c271] px-4 py-1.5 text-sm font-medium text-white hover:shadow-md transition-all duration-200 hover:translate-y-[-1px]"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:hidden">
              {user && <NotificationPanel />}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg p-2 bg-white/50 text-gray-500 hover:bg-white/80 hover:text-gray-700 transition-all"
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
      )}

      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white rounded-xl shadow-lg mt-2 mx-4 border border-gray-100`}>
        <div className="space-y-1 px-4 py-3">
          {navigation.map((navItem) => (
            <Link
              key={navItem.name}
              to={navItem.href}
              className={`block py-2.5 px-3 text-base font-medium rounded-lg transition-colors ${
                location.pathname === navItem.href
                  ? 'text-[#69db7c] bg-[#f0fff4]'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {navItem.name}
            </Link>
          ))}
        </div>
        {user ? (
          <div className="border-t border-gray-100 px-4 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&bold=true`}
                  alt={user.name}
                  className="h-10 w-10 rounded-full ring-1 ring-gray-200"
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
                className="block py-2.5 px-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="block py-2.5 px-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
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
                className="block w-full text-left py-2.5 px-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-100 px-4 py-4 space-y-2">
            <Link
              to="/login"
              className="block w-full py-2.5 px-3 text-center text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block w-full py-2.5 text-center text-base font-medium text-white bg-gradient-to-r from-[#69db7c] to-[#56c271] rounded-xl hover:shadow-md transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        )}
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 mt-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout 