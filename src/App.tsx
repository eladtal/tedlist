import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import SubmitItem from './pages/SubmitItem'
import ItemSelection from './components/ItemSelection'
import SwipeInterface from './components/SwipeInterface'
import Notifications from './pages/Notifications'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import MyDeals from './pages/Deals'

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="submit" element={<ProtectedRoute><SubmitItem /></ProtectedRoute>} />
          <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="my-deals" element={<ProtectedRoute><MyDeals /></ProtectedRoute>} />
          <Route path="trade">
            <Route path="select" element={<ProtectedRoute><ItemSelection /></ProtectedRoute>} />
            <Route path="swipe" element={<ProtectedRoute><SwipeInterface /></ProtectedRoute>} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="bottom-right" />
    </>
  )
}

export default App 