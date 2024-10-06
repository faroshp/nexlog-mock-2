"use client"

import { useState, useEffect } from 'react'
import EmployeeDashboard from '@/components/EmployeeDashboard'
import AdminDashboard from '@/components/AdminDashboard'

// Mock authentication function (replace with your actual auth logic)
const getCurrentUser = () => {
  console.log("Getting current user");
  return {
    id: 1,
    name: 'Farosh',
    role: 'admin' // or 'employee'
  }
}

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    console.log("DashboardPage useEffect running");
    const user = getCurrentUser()
    console.log("Current user:", user);
    setCurrentUser(user)
  }, [])

  console.log("Rendering DashboardPage, currentUser:", currentUser);

  if (!currentUser) {
    console.log("Rendering loading state");
    return <div>Loading...</div>
  }

  console.log("Rendering dashboard for role:", currentUser.role);

  return (
    <>
      {currentUser.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <EmployeeDashboard />
      )}
    </>
  )
}