"use client"

import type React from "react"


import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Home, Building, Navigation } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProfileSetupPage() {
  const [addressData, setAddressData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    landmark: "",
  })

  const [userData, setUserData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    // Try to get user data from URL parameters first
    const urlId = searchParams.get('id')
    const urlFirstName = searchParams.get('firstName')
    const urlLastName = searchParams.get('lastName')
    const urlEmail = searchParams.get('email')
    const urlPhone = searchParams.get('phone')
    const urlRole = searchParams.get('role')

    if (urlId && urlFirstName) {
      // Use URL parameters
      setUserData({
        id: urlId,
        firstName: urlFirstName,
        lastName: urlLastName || '',
        email: urlEmail || '',
        phone: urlPhone || '',
        role: urlRole || 'citizen',
      })
    } else {
      // Fallback to localStorage
      const existingUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (existingUser.id && existingUser.firstName) {
        setUserData({
          id: existingUser.id,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName || '',
          email: existingUser.email || '',
          phone: existingUser.phone || '',
          role: existingUser.role || 'citizen',
        })
      } else {
        toast({
          title: "User data not found",
          description: "Please sign up first.",
          variant: "destructive",
        })
        router.push("/auth/signup")
      }
    }
  }, [searchParams, router, toast])

  const handleInputChange = (field: string, value: string) => {
    setAddressData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {

      // Validate user data
      if (!userData.id || !userData.firstName) {
        toast({
          title: "User data not found",
          description: "Please sign up first.",
          variant: "destructive",
        })
        router.push("/auth/signup")
        return
      }

      // Prepare query parameters for backend
      const params = new URLSearchParams({
        id: userData.id,
        name: userData.firstName,
        last_name: userData.lastName,
        address_line1: addressData.addressLine1,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pinCode,
      })

      console.log("Sending data to backend:", params.toString())

      // Call backend endpoint with query parameters
      const response = await fetch(`http://localhost:8000/add_user?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Backend error:", errorText)
        throw new Error(`Failed to save user data: ${response.status} ${errorText}`)
      }

      // Save complete user data to localStorage
      const updatedUser = { 
        ...userData,
        address: addressData, 
        profileComplete: true 
      }

      localStorage.setItem("user", JSON.stringify(updatedUser))

      toast({
        title: "Profile setup complete!",
        description: "Welcome to your Waste Samaritan dashboard.",
      })

      router.push("/citizen/dashboard")
    } catch (error) {

      console.error("Error saving user data:", error)
      toast({
        title: "Setup failed",
        description: error instanceof Error ? error.message : "Please try again later.",

        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6 text-green-600" />
            Complete Your Profile
          </CardTitle>
          <CardDescription>Please provide your address details to help us serve you better</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="addressLine1"
                    placeholder="House/Flat No., Street"
                    value={addressData.addressLine1}
                    onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="addressLine2"
                    placeholder="Area, Locality"
                    value={addressData.addressLine2}
                    onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="Enter your city"
                  value={addressData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="Enter your state"
                  value={addressData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pinCode">PIN Code *</Label>
                <Input
                  id="pinCode"
                  placeholder="Enter PIN code"
                  value={addressData.pinCode}
                  onChange={(e) => handleInputChange("pinCode", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark</Label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="landmark"
                    placeholder="Nearby landmark"
                    value={addressData.landmark}
                    onChange={(e) => handleInputChange("landmark", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Setting up profile..." : "Complete Setup"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
