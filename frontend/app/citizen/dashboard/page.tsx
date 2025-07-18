"use client"

import type React from "react"


import { useState, useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Recycle, Camera, Star, Trophy, Leaf, Droplets, Package, X, Upload, User, LogOut, Check, RotateCcw, AlertCircle, Lightbulb, Target, Shield, Zap, Info, ChevronRight, Eye, CheckCircle, XCircle } from "lucide-react"
import LearningTab from "@/components/learning/LearningTab"

import { useToast } from "@/hooks/use-toast"

export default function CitizenDashboard() {
  const [user, setUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const [ratings, setRatings] = useState<{[key: string]: number | null}>({
    wet: null,
    recyclable: null,
    'non-recyclable': null
  })
  const [analysisResults, setAnalysisResults] = useState<{[key: string]: any}>({})
  const [loading, setLoading] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const wasteCategories = [
    {
      id: "wet",
      name: "Wet Waste",
      icon: Droplets,
      color: "bg-green-100 text-green-800",
      description: "Organic waste, food scraps",
    },
    {

      id: "recyclable",
      name: "Recyclable",
      icon: Recycle,
      color: "bg-purple-100 text-purple-800",
      description: "Bottles, cans, newspapers",
    },
    {

      id: "non-recyclable",
      name: "Non Recyclable",

      icon: X,
      color: "bg-red-100 text-red-800",
      description: "Hazardous, non-recyclable",
    },

  ]

  // Check if all categories have been processed
  const allCategoriesProcessed = Object.values(ratings).every(rating => rating !== null)
  const processedCount = Object.values(ratings).filter(rating => rating !== null).length

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to take photos",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)
        
        const imageData = canvas.toDataURL('image/jpeg')
        setCapturedImage(imageData)
        setShowImageDialog(true)
        stopCamera()
      }
    }
  }

  const confirmImage = () => {
    if (capturedImage) {
      setUploadedImage(capturedImage)
      setShowImageDialog(false)
      setCapturedImage(null)
    }
  }

  const retakeImage = () => {
    setShowImageDialog(false)
    setCapturedImage(null)
    startCamera()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setUploadedImage(imageData)

      }
      reader.readAsDataURL(file)
    }
  }


  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload an image smaller than 5MB",
            variant: "destructive",
          })
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = e.target?.result as string
          setUploadedImage(imageData)
        }
        reader.readAsDataURL(file)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        })
      }
    }
  }

  const processImage = async () => {
    if (!uploadedImage || !selectedCategory) return

    setLoading(true)
    try {

      // Convert base64 to blob for sending to backend
      const base64Data = uploadedImage.split(',')[1]
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob())
      
      // Create FormData to send to backend
      const formData = new FormData()
      formData.append('image', blob, 'waste-image.jpg')
      formData.append('category', selectedCategory)
      formData.append('userId', user.id || user.email)

      // Send to backend
      const response = await fetch('/api/process-waste', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process image')
      }

      const result = await response.json()
      
      // Update ratings and analysis results for the current category
      setRatings(prev => ({
        ...prev,
        [selectedCategory]: result.rating
      }))
      setAnalysisResults(prev => ({
        ...prev,
        [selectedCategory]: result
      }))

      toast({
        title: "Image analyzed successfully!",
        description: `Your ${selectedCategory} waste segregation has been rated ${result.rating} stars by Gemini AI.`,
      })

      // If all categories are processed, send to backend
      if (processedCount + 1 === 3) {
        await sendRatingsToBackend()
      }
    } catch (error) {
      console.error('Error processing image:', error)

      toast({
        title: "Processing failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }


  const sendRatingsToBackend = async () => {
    try {
      // Create query parameters for the POST request
      const params = new URLSearchParams({
        user_id: user.id,
        rating_1: ratings.wet?.toString() || '0',
        rating_2: ratings.recyclable?.toString() || '0',
        rating_3: ratings['non-recyclable']?.toString() || '0'
      })

      const response = await fetch(`http://localhost:8000/trash_upload?${params.toString()}`, {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: "All ratings submitted successfully!",
          description: "Your waste segregation data has been saved.",
        })
      } else {
        throw new Error('Failed to submit ratings')
      }
    } catch (error) {
      console.error('Error submitting ratings:', error)
      toast({
        title: "Failed to submit ratings",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const resetUpload = () => {
    stopCamera()
    setSelectedCategory(null)
    setUploadedImage(null)
    setCapturedImage(null)
    setShowImageDialog(false)
    setIsDragOver(false)
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const resetAllCategories = () => {
    setRatings({
      wet: null,
      recyclable: null,
      'non-recyclable': null
    })
    setAnalysisResults({})
    resetUpload()

  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold">Waste Samaritan</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="segregation" className="space-y-6">

          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="segregation">Waste Segregation</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>

            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="segregation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-6 w-6" />
                  Waste Segregation Portal
                </CardTitle>
                <CardDescription>

                  Upload images for all three waste categories and get AI-powered feedback on your segregation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Overview */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-blue-900">Progress: {processedCount}/3 Categories</h3>
                    <Badge variant={allCategoriesProcessed ? "default" : "secondary"}>
                      {allCategoriesProcessed ? "Complete" : "In Progress"}
                    </Badge>
                  </div>
                  <Progress value={(processedCount / 3) * 100} className="h-2" />
                  <p className="text-sm text-blue-700 mt-2">
                    {allCategoriesProcessed 
                      ? "All categories processed! Ratings will be submitted to the system."
                      : `Process ${3 - processedCount} more category${3 - processedCount > 1 ? 'ies' : 'y'} to complete.`
                    }
                  </p>
                </div>

                {/* Category Selection */}
                <div>
                  <h3 className="text-xl font-bold mb-6 text-gray-800">Select Waste Category</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {wasteCategories.map((category) => {
                      const IconComponent = category.icon
                      const isProcessed = ratings[category.id] !== null
                      const isSelected = selectedCategory === category.id
                      
                      return (
                        <Card
                          key={category.id}
                          className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                            isSelected 
                              ? "ring-2 ring-green-500 bg-green-50 border-green-300 shadow-lg" 
                              : isProcessed
                              ? "ring-2 ring-blue-500 bg-blue-50 border-blue-300"
                              : "hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <CardContent className="p-6 text-center">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                              isSelected 
                                ? "bg-green-100 text-green-600" 
                                : isProcessed
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              <IconComponent className="h-8 w-8" />
                            </div>
                            <h4 className="font-semibold text-lg mb-2 text-gray-800">{category.name}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">{category.description}</p>
                            
                            {isProcessed && (
                              <div className="flex items-center justify-center gap-2 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${star <= (ratings[category.id] || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                  />
                                ))}
                                <span className="text-sm font-medium text-gray-700">
                                  {ratings[category.id]}/5
                                </span>
                              </div>
                            )}
                            
                            <div className="flex gap-2 justify-center">
                              {isSelected && (
                                <Badge className="bg-green-500 text-white">Selected</Badge>
                              )}
                              {isProcessed && (
                                <Badge className="bg-blue-500 text-white">Completed</Badge>
                              )}
                            </div>

                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>


                {/* Image Capture */}
                {selectedCategory && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Capture or Upload {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Waste Image</h3>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDragOver 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >

                      {uploadedImage ? (
                        <div className="space-y-4">
                          <img
                            src={uploadedImage || "/placeholder.svg"}

                            alt="Captured waste"
                            className="max-w-xs mx-auto rounded-lg shadow-md"

                          />
                          <div className="flex gap-2 justify-center">
                            <Button onClick={processImage} disabled={loading}>
                              {loading ? "Processing..." : "Analyze Image"}
                            </Button>
                            <Button variant="outline" onClick={resetUpload}>

                              Choose Different Image
                            </Button>
                          </div>
                        </div>
                      ) : isCameraActive ? (
                        <div className="space-y-4">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="max-w-xs mx-auto rounded-lg shadow-md"
                          />
                          <div className="flex gap-2 justify-center">
                            <Button onClick={captureImage} className="bg-green-600 hover:bg-green-700">
                              Capture Photo
                            </Button>
                            <Button variant="outline" onClick={stopCamera}>
                              Cancel

                            </Button>
                          </div>
                        </div>
                      ) : (

                        <div className="space-y-6">
                          <div className="flex justify-center">
                            <div className="text-center">
                              <Camera className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-4" />
                            </div>
                          </div>
                          <p className="text-gray-600 mb-6">
                            Choose how you want to add your {selectedCategory} waste image
                            <br />
                            <span className="text-sm text-gray-500">
                              You can also drag and drop an image here
                            </span>
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
                              <Camera className="h-4 w-4 mr-2" />
                              Take Photo
                            </Button>
                            <Button onClick={triggerFileUpload} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Image
                          </Button>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                )}

                {/* Action Buttons */}
                {allCategoriesProcessed && (
                  <div className="text-center space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-900 mb-2">All Categories Processed!</h3>
                      <p className="text-green-700 text-sm">
                        Your ratings have been submitted to the system. You can start over or view your results.
                      </p>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={resetAllCategories} variant="outline">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Start Over
                      </Button>
                      <Button onClick={() => {}} className="bg-green-600 hover:bg-green-700">
                        <Eye className="h-4 w-4 mr-2" />
                        View Results
                      </Button>
                    </div>
                  </div>
                )}

                {/* Detailed Analysis Results for Current Category */}
                {selectedCategory && analysisResults[selectedCategory] && (
                  <div className="space-y-6">
                    <Card className={`${analysisResults[selectedCategory].category_match ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                      <CardContent className="p-6">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                            <Star className="h-6 w-6 text-yellow-400" />
                            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Waste Analysis
                          </h3>
                          <div className="flex justify-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-10 w-10 ${star <= (ratings[selectedCategory] || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <p className={`text-xl font-bold ${analysisResults[selectedCategory].category_match ? 'text-green-800' : 'text-orange-800'}`}>
                            Rating: {ratings[selectedCategory]}/5 stars
                          </p>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Analysis Summary</h4>
                          <p className="text-gray-700 leading-relaxed">
                            {analysisResults[selectedCategory].detailed_feedback}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">156</p>
                      <p className="text-sm text-gray-600">Total Points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Star className="h-8 w-8 text-yellow-400" />
                    <div>
                      <p className="text-2xl font-bold">4.2</p>
                      <p className="text-sm text-gray-600">Avg Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Recycle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">23</p>
                      <p className="text-sm text-gray-600">Submissions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Leaf className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-gray-600">Streak Days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
                <CardDescription>Your waste segregation activity this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Segregation Accuracy</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Daily Goal</span>
                      <span>5/7 days</span>
                    </div>
                    <Progress value={71} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="learning" className="space-y-6">
            <LearningTab />
          </TabsContent>


          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Role</Label>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>
                </div>

                {user.address && (
                  <div>
                    <Label className="text-sm font-medium">Address</Label>
                    <p className="text-gray-900">
                      {user.address.addressLine1}, {user.address.addressLine2}
                      <br />
                      {user.address.city}, {user.address.state} - {user.address.pinCode}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>


      {/* Image Preview Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Captured Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {capturedImage && (
              <div className="text-center">
                <img
                  src={capturedImage}
                  alt="Captured waste"
                  className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Is this image clear enough for analysis?
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={retakeImage}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Photo
            </Button>
            <Button onClick={confirmImage}>
              <Check className="h-4 w-4 mr-2" />
              Use This Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}

