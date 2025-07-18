"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import LearningWelcome from "./LearningWelcome"
import VideoCarousel from "./VideoCarousel"
import WasteGuide from "./WasteGuide"
import InteractiveQuiz from "./InteractiveQuiz"
import FunFacts from "./FunFacts"
import VideoModal from "./VideoModal"
import { learningVideos, wasteGuide, quizQuestions, Video } from "./learningData"

export default function LearningTab() {
  const [watchedVideos, setWatchedVideos] = useState<Set<number>>(new Set())
  const [completedQuiz, setCompletedQuiz] = useState(false)
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [showQuizResult, setShowQuizResult] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const { toast } = useToast()

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video)
    setShowVideoModal(true)
    // Mark video as watched
    setWatchedVideos(prev => new Set([...prev, video.id]))
  }

  const closeVideoModal = () => {
    setShowVideoModal(false)
    setSelectedVideo(null)
  }

  const handleQuizAnswer = (selectedAnswer: number) => {
    const currentQuestion = quizQuestions[currentQuizQuestion]
    if (selectedAnswer === currentQuestion.correct) {
      setQuizScore(quizScore + 1)
      toast({
        title: "Correct! 🎉",
        description: currentQuestion.explanation,
      })
    } else {
      toast({
        title: "Incorrect",
        description: currentQuestion.explanation,
        variant: "destructive",
      })
    }

    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1)
    } else {
      setShowQuizResult(true)
      setCompletedQuiz(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuizQuestion(0)
    setQuizScore(0)
    setShowQuizResult(false)
  }

  return (
    <div className="space-y-6">
      <LearningWelcome 
        watchedVideos={watchedVideos}
        totalVideos={learningVideos.length}
        completedQuiz={completedQuiz}
      />

      <VideoCarousel 
        videos={learningVideos}
        watchedVideos={watchedVideos}
        onVideoClick={handleVideoClick}
      />

      <WasteGuide wasteGuide={wasteGuide} />

      <InteractiveQuiz 
        quizQuestions={quizQuestions}
        currentQuizQuestion={currentQuizQuestion}
        quizScore={quizScore}
        showQuizResult={showQuizResult}
        onAnswerSelect={handleQuizAnswer}
        onResetQuiz={resetQuiz}
      />

      <FunFacts />

      <VideoModal 
        isOpen={showVideoModal}
        onClose={closeVideoModal}
        selectedVideo={selectedVideo}
      />
    </div>
  )
} 