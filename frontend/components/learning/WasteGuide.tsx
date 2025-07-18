"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, Droplets, X, Info } from "lucide-react"

interface WasteGuideItem {
  category: string
  icon: any
  color: string
  items: string[]
  tips: string
}

interface WasteGuideProps {
  wasteGuide: WasteGuideItem[]
}

export default function WasteGuide({ wasteGuide }: WasteGuideProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-6 w-6 text-blue-600" />
          Waste Segregation Guide
        </CardTitle>
        <CardDescription>
          Learn what goes where and how to properly segregate your waste
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wasteGuide.map((guide) => {
            const IconComponent = guide.icon
            return (
              <Card key={guide.category} className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${guide.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{guide.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-800">Includes:</h4>
                    <ul className="space-y-1">
                      {guide.items.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">💡 Tip:</p>
                    <p className="text-sm text-blue-700">{guide.tips}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 