"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, Trophy } from "lucide-react"

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface InteractiveQuizProps {
  quizQuestions: QuizQuestion[]
  currentQuizQuestion: number
  quizScore: number
  showQuizResult: boolean
  onAnswerSelect: (selectedAnswer: number) => void
  onResetQuiz: () => void
}

export default function InteractiveQuiz({ 
  quizQuestions, 
  currentQuizQuestion, 
  quizScore, 
  showQuizResult, 
  onAnswerSelect, 
  onResetQuiz 
}: InteractiveQuizProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-6 w-6 text-yellow-600" />
          Test Your Knowledge
        </CardTitle>
        <CardDescription>
          Take a quiz to test your waste management knowledge and earn points!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showQuizResult ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Question {currentQuizQuestion + 1} of {quizQuestions.length}</span>
                <Progress value={((currentQuizQuestion + 1) / quizQuestions.length) * 100} className="w-32" />
              </div>
              <Badge variant="secondary">Score: {quizScore}</Badge>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                {quizQuestions[currentQuizQuestion].question}
              </h3>
              <div className="space-y-3">
                {quizQuestions[currentQuizQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto p-4 text-left hover:bg-green-50 hover:border-green-300"
                    onClick={() => onAnswerSelect(index)}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-green-100 p-8 rounded-full">
                <Trophy className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h3>
              <p className="text-lg text-gray-600 mb-4">
                You scored {quizScore} out of {quizQuestions.length} points
              </p>
              <div className="flex justify-center">
                <Progress 
                  value={(quizScore / quizQuestions.length) * 100} 
                  className="w-64 h-3" 
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {quizScore === quizQuestions.length 
                  ? "Perfect! You're a waste management expert! 🌟"
                  : quizScore >= quizQuestions.length * 0.7
                  ? "Great job! You have good knowledge of waste management! 👍"
                  : "Keep learning! Practice makes perfect! 📚"
                }
              </p>
            </div>
            <Button onClick={onResetQuiz} className="bg-green-600 hover:bg-green-700">
              Take Quiz Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 