"use client"

import { useState, useEffect } from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Play, Square, Star, MapPin, Clock, CheckCircle, LogOut, Recycle, Route, Navigation } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type House = {
  id: string;
  name: string;
  address: string;
  rating: number;
  lastCollection: string | null;
  wasteType: string;
  status?: string; // optional, if you're using isCompleted
};


export default function CollectorDashboard() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [isCollecting, setIsCollecting] = useState(false)
  const [collectionStartTime, setCollectionStartTime] = useState<Date | null>(null)
  const [completedHouses, setCompletedHouses] = useState<Set<string>>(new Set())

  const [houses, setHouses] = useState<House[]>([]);
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Assuming parsedUser.id or parsedUser.uid is your collector_id
      fetchAssignedTrash(parsedUser.id).then(setHouses);
    }
  }, []);

  async function fetchAssignedTrash(collectorId: any) {
    try {
      const response = await fetch(`http://localhost:8000/get_trash_for_collector/${collectorId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch assigned trash");
      }

      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error("Error fetching trash:", error);
      return [];
    }
  }



  const startCollection = () => {
    setIsCollecting(true)
    setCollectionStartTime(new Date())
    toast({
      title: "Collection started",
      description: "Your collection route has been activated.",
    })
  }

  const endCollection = () => {
    setIsCollecting(false)
    setCollectionStartTime(null)
    setCompletedHouses(new Set())
    toast({
      title: "Collection completed",
      description: "Your collection route has been completed successfully.",
    })
  }

  const startHouseCollection = (houseId: string) => {
    toast({
      title: "House collection started",
      description: "Collection timer started for this house.",
    })
  }

  const endHouseCollection = (houseId: string) => {
    setCompletedHouses((prev) => new Set([...prev, houseId]))
    toast({
      title: "House collection completed",
      description: "Collection completed and logged successfully.",
    })
  }

  const getElapsedTime = () => {
    if (!collectionStartTime) return "00:00:00"
    const now = new Date()
    const diff = now.getTime() - collectionStartTime.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
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

      <div className="container mx-auto px-4 py-8 space-y-6">

        {/* Quick Navigation */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Route Optimization</h3>
                  <p className="text-blue-100 text-sm">Plan your collection routes efficiently</p>
                </div>
                <Route className="h-8 w-8" />
              </div>
              <Button 
                variant="outline" 
                className="mt-4 bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => router.push('/collector/route-optimization')}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Plan Route
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Collection Status</h3>
                  <p className="text-green-100 text-sm">Monitor your daily progress</p>
                </div>
                <Truck className="h-8 w-8" />
              </div>
              <div className="mt-4 text-2xl font-bold">
                {completedHouses.size}/{houses.length} completed
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Collection Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-6 w-6" />
              Collection Control
            </CardTitle>
            <CardDescription>Start or end your collection route</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {isCollecting ? (
                  <Button onClick={endCollection} variant="destructive" size="lg">
                    <Square className="h-5 w-5 mr-2" />
                    End Collection
                  </Button>
                ) : (
                  <Button onClick={startCollection} size="lg">
                    <Play className="h-5 w-5 mr-2" />
                    Start Collection
                  </Button>
                )}

                {isCollecting && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Elapsed: {getElapsedTime()}</span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600">Today's Progress</p>
                <p className="text-2xl font-bold">
                  {completedHouses.size}/{houses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Houses List */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Collection Route</CardTitle>
            <CardDescription>Houses scheduled for waste collection today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {houses.map((house) => {
                const isCompleted = completedHouses.has(house.id)
                return (
                  <Card key={house.id} className={`${isCompleted ? "bg-green-50 border-green-200" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{house.name}</h3>
                            {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>{house.address}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span>{house.rating}</span>
                            </div>
                            <Badge variant="outline">{house.wasteType}</Badge>
                            <span className="text-gray-500">Last: {house.lastCollection}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {!isCompleted && isCollecting && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => startHouseCollection(house.id)}>
                                Start
                              </Button>
                              <Button size="sm" onClick={() => endHouseCollection(house.id)}>
                                Complete
                              </Button>
                            </>
                          )}
                          {isCompleted && (
                            <Badge variant="default" className="bg-green-600">
                              Completed
                            </Badge>
                          )}
                          {!isCollecting && <Badge variant="secondary">Pending</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{completedHouses.size}</p>
                  <p className="text-sm text-gray-600">Completed Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{houses.length - completedHouses.size}</p>
                  <p className="text-sm text-gray-600">Remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Star className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">4.3</p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Truck className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-sm text-gray-600">Efficiency</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}