"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface Video {
  id: number
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  duration: string
}

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  selectedVideo: Video | null
}

export default function VideoModal({ isOpen, onClose, selectedVideo }: VideoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{selectedVideo?.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {selectedVideo && (
            <div className="aspect-video w-full">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                className="w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{selectedVideo?.title}</h3>
            <p className="text-gray-600">{selectedVideo?.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Play className="h-4 w-4" />
              <span>Duration: {selectedVideo?.duration}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 