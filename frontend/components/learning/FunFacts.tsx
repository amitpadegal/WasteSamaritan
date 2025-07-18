"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

export default function FunFacts() {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Lightbulb className="h-6 w-6" />
          Did You Know?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">♻️ Recycling Impact</h4>
            <p className="text-sm text-gray-700">
              Recycling one aluminum can saves enough energy to run a TV for 3 hours!
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">🌱 Composting Benefits</h4>
            <p className="text-sm text-gray-700">
              Composting reduces methane emissions and creates nutrient-rich soil for plants.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">📊 Waste Statistics</h4>
            <p className="text-sm text-gray-700">
              The average person generates about 4.4 pounds of waste per day.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">🌍 Global Impact</h4>
            <p className="text-sm text-gray-700">
              Proper waste segregation can reduce landfill waste by up to 60%!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 