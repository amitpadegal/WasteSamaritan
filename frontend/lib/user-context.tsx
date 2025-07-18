"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  address?: any
  profileComplete?: boolean
}

interface UserContextType {
  userData: UserData | null
  setUserData: (data: UserData) => void
  clearUserData: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserData | null>(null)

  const setUserData = (data: UserData) => {
    setUserDataState(data)
    // Also save to localStorage for persistence
    localStorage.setItem("user", JSON.stringify(data))
  }

  const clearUserData = () => {
    setUserDataState(null)
    localStorage.removeItem("user")
  }

  return (
    <UserContext.Provider value={{ userData, setUserData, clearUserData }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 