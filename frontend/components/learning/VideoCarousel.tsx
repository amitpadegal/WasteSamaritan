"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Play } from "lucide-react"

interface Video {
  id: number
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  duration: string
}

interface VideoCarouselProps {
  videos: Video[]
  watchedVideos: Set<number>
  onVideoClick: (video: Video) => void
}

export default function VideoCarousel({ videos, watchedVideos, onVideoClick }: VideoCarouselProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-6 w-6 text-red-600" />
          Educational Videos
        </CardTitle>
        <CardDescription>
          Watch informative videos about waste management and segregation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
          <CarouselContent>
            {videos.map((video) => (
              <CarouselItem key={video.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <Button 
                        size="lg" 
                        className="bg-white text-black hover:bg-gray-100"
                        onClick={() => onVideoClick(video)}
                      >
                        <Play className="h-6 w-6 mr-2" />
                        Watch Video
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                    {watchedVideos.has(video.id) && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                        ✓ Watched
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-2">{video.title}</h4>
                    <p className="text-sm text-gray-600">{video.description}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  )
} 