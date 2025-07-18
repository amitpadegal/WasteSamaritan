"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Route, 
  Plus, 
  Trash2, 
  Navigation, 
  Clock, 
  Ruler,
  Car,
  RefreshCw,
  Download,
  Eye,
  EyeOff
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Types
interface Address {
  id: string
  address: string
  coordinates?: [number, number]
  isValid?: boolean
}

interface StartingPoint {
  address: string
  coordinates?: [number, number]
  isValid?: boolean
}

interface RouteInfo {
  totalDistance: number
  estimatedTime: number
  optimizedOrder: number[]
  startingPoint?: StartingPoint
}

export default function RouteOptimizationPage() {
  const [startingPoint, setStartingPoint] = useState<StartingPoint>({
    address: '',
    coordinates: undefined,
    isValid: false
  })
  const [addresses, setAddresses] = useState<Address[]>([
    { id: '1', address: '', coordinates: undefined, isValid: false }
  ])
  const [map, setMap] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [startingMarker, setStartingMarker] = useState<any>(null)
  const [routeLayer, setRouteLayer] = useState<any>(null)
  const [routingControl, setRoutingControl] = useState<any>(null)
  const [routeDirections, setRouteDirections] = useState<any[]>([])
  const [currentRouteData, setCurrentRouteData] = useState<any>(null)
  const [showAddresses, setShowAddresses] = useState(true)
  const mapRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Initialize map
  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !map) {
      // Load Leaflet CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/leaflet.css'
      document.head.appendChild(link)

      // Load Leaflet Routing Machine CSS
      const routingCSS = document.createElement('link')
      routingCSS.rel = 'stylesheet'
      routingCSS.href = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css'
      document.head.appendChild(routingCSS)

      // Load Leaflet JS
      const script = document.createElement('script')
      script.src = '/leaflet.js'
      script.onload = () => {
        // Load Leaflet Routing Machine JS
        const routingScript = document.createElement('script')
        routingScript.src = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js'
        routingScript.onload = () => {
          const L = (window as any).L
          const newMap = L.map(mapRef.current!).setView([28.6139, 77.2090], 11) // Delhi center

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(newMap)

          setMap(newMap)
        }
        document.head.appendChild(routingScript)
      }
      document.head.appendChild(script)
    }
  }, [map])

  // Geocoding function using Nominatim API
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      )
      const data = await response.json()
      
      if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
      }
      return null
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Traveling Salesman Problem solver using nearest neighbor heuristic
  // Now takes starting point coordinates and stop coordinates separately
  const solveTSPWithStartingPoint = (startingCoords: [number, number], stopCoordinates: [number, number][]): number[] => {
    if (stopCoordinates.length === 0) return []
    if (stopCoordinates.length === 1) return [0]
    
    const n = stopCoordinates.length
    const visited = new Array(n).fill(false)
    const path: number[] = []
    
    // Find the closest stop to starting point
    let minDistance = Infinity
    let firstStopIndex = -1
    
    for (let i = 0; i < n; i++) {
      const distance = calculateDistance(
        startingCoords[0], startingCoords[1],
        stopCoordinates[i][0], stopCoordinates[i][1]
      )
      
      if (distance < minDistance) {
        minDistance = distance
        firstStopIndex = i
      }
    }
    
    if (firstStopIndex !== -1) {
      path.push(firstStopIndex)
      visited[firstStopIndex] = true
    }
    
    // Continue with nearest neighbor from current position
    for (let i = 1; i < n; i++) {
      let minDistance = Infinity
      let nextIndex = -1
      
      for (let j = 0; j < n; j++) {
        if (!visited[j]) {
          const current = path[path.length - 1]
          const distance = calculateDistance(
            stopCoordinates[current][0], stopCoordinates[current][1],
            stopCoordinates[j][0], stopCoordinates[j][1]
          )
          
          if (distance < minDistance) {
            minDistance = distance
            nextIndex = j
          }
        }
      }
      
      if (nextIndex !== -1) {
        path.push(nextIndex)
        visited[nextIndex] = true
      }
    }
    
    return path
  }

  // Add new address input
  const addAddress = () => {
    setAddresses([...addresses, { 
      id: Date.now().toString(), 
      address: '', 
      coordinates: undefined, 
      isValid: false 
    }])
  }

  // Remove address
  const removeAddress = (id: string) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter(addr => addr.id !== id))
    }
  }

  // Update address
  const updateAddress = (id: string, address: string) => {
    setAddresses(addresses.map(addr => 
      addr.id === id ? { ...addr, address, isValid: false } : addr
    ))
  }

  // Update starting point
  const updateStartingPoint = (address: string) => {
    setStartingPoint({ address, coordinates: undefined, isValid: false })
  }

  // Clear all markers and routes
  const clearMapElements = () => {
    if (map) {
      markers.forEach(marker => map.removeLayer(marker))
      if (startingMarker) map.removeLayer(startingMarker)
      if (routeLayer) map.removeLayer(routeLayer)
      if (routingControl) {
        map.removeControl(routingControl)
        setRoutingControl(null)
      }
      setMarkers([])
      setStartingMarker(null)
      setRouteLayer(null)
      setRouteDirections([])
      setCurrentRouteData(null)
    }
  }

  // Optimize route
  const optimizeRoute = async () => {
    if (!map) return
    
    setIsLoading(true)
    clearMapElements()
    
    try {
      // Geocode all addresses
      const geocodedAddresses = await Promise.all(
        addresses.map(async (addr) => {
          if (!addr.address.trim()) return null
          
          const coords = await geocodeAddress(addr.address)
          return coords ? { ...addr, coordinates: coords, isValid: true } : null
        })
      )
      
      const validAddresses = geocodedAddresses.filter(Boolean) as Address[]
      
      if (validAddresses.length < 1) {
        toast({
          title: "Insufficient addresses",
          description: "Please provide at least 1 valid stop address for route optimization.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      
      if (!startingPoint.address.trim()) {
        toast({
          title: "Missing starting point",
          description: "Please provide a starting address for route optimization.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      
      // Update addresses with coordinates
      setAddresses(addresses.map(addr => {
        const validated = validAddresses.find(v => v.id === addr.id)
        return validated || { ...addr, isValid: false }
      }))
      
      // Initialize Leaflet
      const L = (window as any).L
      
      // Geocode starting point
      const startingCoords = await geocodeAddress(startingPoint.address)
      
      if (!startingCoords) {
        toast({
          title: "Invalid starting address",
          description: "Please provide a valid starting address.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      
      // Update starting point with coordinates
      const validatedStartingPoint = { ...startingPoint, coordinates: startingCoords, isValid: true }
      setStartingPoint(validatedStartingPoint)
      
      // Create starting point marker
      const startingMarkerIcon = L.divIcon({
        className: 'starting-marker',
        html: `<div style="
          background: #10B981; 
          color: white; 
          width: 30px; 
          height: 30px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: bold; 
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">S</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })
      
      const newStartingMarker = L.marker(startingCoords, { icon: startingMarkerIcon })
        .addTo(map)
        .bindPopup('<strong>Starting Point</strong><br>' + startingPoint.address)
      setStartingMarker(newStartingMarker)
      
      // Create numbered markers for stops
      const stopCoordinates = validAddresses.map(addr => addr.coordinates!) as [number, number][]
      const stopMarkers = validAddresses.map((addr, index) => {
        const markerIcon = L.divIcon({
          className: 'numbered-marker',
          html: `<div style="
            background: #3B82F6; 
            color: white; 
            width: 30px; 
            height: 30px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-weight: bold; 
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ">${index + 1}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
        
        const marker = L.marker(addr.coordinates!, { icon: markerIcon })
          .addTo(map)
          .bindPopup(`<strong>Stop ${index + 1}</strong><br>${addr.address}`)
        return marker
      })
      setMarkers(stopMarkers)
      
      // Optimize route using simple nearest neighbor for waypoint ordering
      const optimizedOrder = solveTSPWithStartingPoint(startingCoords, stopCoordinates)
      
      // Create waypoints for routing machine
      const waypoints = [L.latLng(startingCoords[0], startingCoords[1])]
      optimizedOrder.forEach((index: number) => {
        waypoints.push(L.latLng(stopCoordinates[index][0], stopCoordinates[index][1]))
      })
      
      // Use Leaflet Routing Machine for proper routing with directions
      const routingControl = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: function() { return null; }, // Don't create default markers
        lineOptions: {
          styles: [{ color: '#3B82F6', weight: 4, opacity: 0.8 }]
        },
        show: false, // Don't show the routing panel
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1'
        })
      }).addTo(map)
      
      setRoutingControl(routingControl)
      
      // Handle routing results
      routingControl.on('routesfound', function(e: any) {
        const routes = e.routes
        const summary = routes[0].summary
        const instructions = routes[0].instructions
        
        // Extract route data
        const routeData = {
          totalDistance: (summary.totalDistance / 1000).toFixed(2),
          estimatedTime: Math.round(summary.totalTime / 60),
          instructions: instructions.map((instruction: any) => ({
            text: instruction.text,
            distance: (instruction.distance / 1000).toFixed(2),
            time: Math.round(instruction.time / 60)
          }))
        }
        
        setCurrentRouteData(routeData)
        setRouteDirections(instructions)
        
        // Set route info
        setRouteInfo({
          totalDistance: parseFloat(routeData.totalDistance),
          estimatedTime: routeData.estimatedTime,
          optimizedOrder,
          startingPoint: validatedStartingPoint
        })
        
        // Fit map to show all markers
        const allMarkers = [newStartingMarker, ...stopMarkers]
        const group = L.featureGroup(allMarkers)
        map.fitBounds(group.getBounds().pad(0.1))
      })
      
      routingControl.on('routingerror', function(e: any) {
        console.error('Routing error:', e)
        toast({
          title: "Routing failed",
          description: "Could not calculate route. Please check your addresses.",
          variant: "destructive",
        })
      })
      
      toast({
        title: "Route optimized successfully!",
        description: `Found optimal route with ${validAddresses.length} stops.`,
      })
      
    } catch (error) {
      console.error('Route optimization error:', error)
      toast({
        title: "Optimization failed",
        description: "Unable to optimize route. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Export route data
  const exportRoute = () => {
    if (!routeInfo) return
    
    const routeData = {
      addresses: addresses.filter(addr => addr.isValid),
      routeInfo,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(routeData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `route-optimization-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Route className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Route Optimization</h1>
                <p className="text-gray-600">Plan efficient collection routes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAddresses(!showAddresses)}
              >
                {showAddresses ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showAddresses ? 'Hide' : 'Show'} Addresses
              </Button>
              {routeInfo && (
                <Button variant="outline" size="sm" onClick={exportRoute}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Route
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Address Input Panel */}
          {showAddresses && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Route Planning
                  </CardTitle>
                  <CardDescription>
                    Enter starting point and collection addresses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Starting Point */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Label htmlFor="starting-point" className="text-green-800 font-semibold">
                      Starting Point
                      {startingPoint.isValid && (
                        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                          Valid
                        </Badge>
                      )}
                    </Label>
                    <Input
                      id="starting-point"
                      placeholder="Enter starting address (depot, office, etc.)..."
                      value={startingPoint.address}
                      onChange={(e) => updateStartingPoint(e.target.value)}
                      className={`mt-2 ${startingPoint.isValid === false && startingPoint.address ? 'border-red-500' : 'border-green-300'}`}
                    />
                    <p className="text-sm text-green-600 mt-1">
                      This is where the collection route will begin
                    </p>
                  </div>
                  
                  {/* Collection Stops */}
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-gray-800">Collection Stops</Label>
                    <p className="text-sm text-gray-600 mb-4">
                      Enter addresses for waste collection points
                    </p>
                  </div>
                  
                  {addresses.map((addr, index) => (
                    <div key={addr.id} className="space-y-2">
                      <Label htmlFor={`address-${addr.id}`}>
                        Address {index + 1}
                        {addr.isValid && (
                          <Badge variant="secondary" className="ml-2">
                            Valid
                          </Badge>
                        )}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`address-${addr.id}`}
                          placeholder="Enter full address..."
                          value={addr.address}
                          onChange={(e) => updateAddress(addr.id, e.target.value)}
                          className={addr.isValid === false && addr.address ? 'border-red-500' : ''}
                        />
                        {addresses.length > 1 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeAddress(addr.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={addAddress}
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                    <Button 
                      onClick={optimizeRoute}
                      disabled={isLoading || addresses.filter(a => a.address.trim()).length < 1 || !startingPoint.address.trim()}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Navigation className="h-4 w-4 mr-2" />
                      )}
                      {isLoading ? 'Optimizing...' : 'Optimize Route'}
                    </Button>
                  </div>
                  
                  {routeInfo && (
                    <div className="space-y-4">
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-3">Route Summary</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm">
                              <Ruler className="h-4 w-4" />
                              Total Distance
                            </span>
                            <span className="font-medium">{routeInfo.totalDistance} km</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4" />
                              Estimated Time
                            </span>
                            <span className="font-medium">{routeInfo.estimatedTime} min</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm">
                              <Car className="h-4 w-4" />
                              Stops
                            </span>
                            <span className="font-medium">{routeInfo.optimizedOrder.length}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Optimized Route</h4>
                        <div className="space-y-1">
                          {/* Starting Point */}
                          <div className="flex items-center gap-2 text-sm">
                            <Badge className="w-8 h-6 flex items-center justify-center bg-green-600">
                              S
                            </Badge>
                            <span className="truncate font-medium text-green-800">
                              {routeInfo.startingPoint?.address || 'Starting Point'}
                            </span>
                          </div>
                          
                          {/* Collection Stops */}
                          {routeInfo.optimizedOrder.map((orderIndex, i) => {
                            const validAddresses = addresses.filter(a => a.isValid)
                            const addr = validAddresses[orderIndex]
                            return addr ? (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <Badge variant="outline" className="w-8 h-6 flex items-center justify-center">
                                  {i + 1}
                                </Badge>
                                <span className="truncate">{addr.address}</span>
                              </div>
                            ) : null
                          })}
                        </div>
                      </div>
                      
                      {/* Turn-by-turn Directions */}
                      {currentRouteData && currentRouteData.instructions && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-3">Turn-by-Turn Directions</h4>
                          <div className="max-h-60 overflow-y-auto space-y-2">
                            {currentRouteData.instructions.map((instruction: any, index: number) => (
                              <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                                <Badge variant="outline" className="w-6 h-6 flex items-center justify-center text-xs">
                                  {index + 1}
                                </Badge>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-800">{instruction.text}</p>
                                  <p className="text-xs text-gray-500">
                                    {instruction.distance} km • {instruction.time} min
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Map */}
          <div className={showAddresses ? "lg:col-span-2" : "lg:col-span-3"}>
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <div ref={mapRef} className="w-full h-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6">
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              <strong>Instructions:</strong> Enter a starting point (depot, office, etc.) and collection addresses. 
              Click "Optimize Route" to find the most efficient path from your starting point to all collection stops. 
              The system will automatically geocode addresses and calculate the shortest route using advanced algorithms.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
} 