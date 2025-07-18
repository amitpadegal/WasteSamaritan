import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, Users, Truck, BarChart3, Leaf } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Waste Samaritan</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Transforming Waste Management Through Digital Engagement
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect citizens, collectors, and administrators in a unified platform for responsible waste management and
            sustainable practices.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Platform Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Citizen Engagement</CardTitle>
              <CardDescription>Empower citizens with digital tools for waste segregation and tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• AI-powered waste categorization</li>
                <li>• Real-time feedback and ratings</li>
                <li>• Gamification and rewards</li>
                <li>• Progress tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Truck className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Collector Efficiency</CardTitle>
              <CardDescription>Streamline collection processes with digital tracking tools</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Real-time collection tracking</li>
                <li>• House-wise feedback ratings</li>
                <li>• Efficient route planning</li>
                <li>• Digital visit logs</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Admin Insights</CardTitle>
              <CardDescription>Data-driven insights for strategic decision making</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Comprehensive analytics dashboard</li>
                <li>• Participation trends</li>
                <li>• Collection efficiency metrics</li>
                <li>• Strategic planning tools</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Segregation Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Active Collectors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600">Registered Citizens</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">80%</div>
              <div className="text-gray-600">Waste Reduction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <Leaf className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h3>
          <p className="text-gray-600 mb-8">
            Join thousands of citizens and collectors working together for a cleaner, more sustainable future.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">Start Your Journey</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Recycle className="h-6 w-6" />
            <span className="text-lg font-semibold">Waste Samaritan</span>
          </div>
          <p className="text-gray-400">
            © 2024 Waste Samaritan. All rights reserved. Building a sustainable future together.
          </p>
        </div>
      </footer>
    </div>
  )
}
