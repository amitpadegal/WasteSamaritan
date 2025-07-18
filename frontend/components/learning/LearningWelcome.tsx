"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Target, Lightbulb, Award } from "lucide-react"

interface LearningWelcomeProps {
  watchedVideos: Set<number>
  totalVideos: number
  completedQuiz: boolean
}

export default function LearningWelcome({ watchedVideos, totalVideos, completedQuiz }: LearningWelcomeProps) {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <BookOpen className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Waste Management Learning Center</h2>
            <p className="text-gray-600">Master the art of proper waste segregation and become an eco-warrior!</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-700">Learn proper segregation</span>
          </div>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span className="text-sm text-gray-700">Discover eco-friendly tips</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-gray-700">Earn knowledge badges</span>
          </div>
        </div>
        
        {/* Learning Progress */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
          <h4 className="font-semibold text-gray-800 mb-3">Your Learning Progress</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Videos Watched</span>
                <span className="font-medium">{watchedVideos.size}/{totalVideos}</span>
              </div>
              <Progress value={(watchedVideos.size / totalVideos) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quiz Completed</span>
                <span className="font-medium">{completedQuiz ? "Yes" : "No"}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className={`h-2 rounded-full ${completedQuiz ? "bg-green-500" : "bg-gray-300"}`} style={{ width: completedQuiz ? "100%" : "0%" }}></div>
              </div>
            </div>
          </div>
          {watchedVideos.size === totalVideos && completedQuiz && (
            <div className="mt-3 p-2 bg-green-100 rounded-lg text-center">
              <span className="text-sm font-medium text-green-800">🎉 Learning Champion! You've completed all activities!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 