import { Recycle, Droplets, X } from "lucide-react"

export interface Video {
  id: number
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  duration: string
}

export interface WasteGuideItem {
  category: string
  icon: any
  color: string
  items: string[]
  tips: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export const learningVideos: Video[] = [
  {
    id: 1,
    title: "Waste Segregation Basics",
    description: "Learn the fundamentals of proper waste segregation",
    thumbnail: "/placeholder.jpg",
    videoUrl: "https://www.youtube.com/embed/ywqMGf_9irI?si=aKr8m77qWbXM_mXF",
    duration: "5:30"
  },
  {
    id: 2,
    title: "Composting at Home",
    description: "Turn your kitchen waste into nutrient-rich compost",
    thumbnail: "/placeholder.jpg",
    videoUrl: "https://www.youtube.com/embed/nxTzuasQLFo?si=Bl5sKxoS8DRlCujJ",
    duration: "8:15"
  },
  {
    id: 3,
    title: "Recycling Do's and Don'ts",
    description: "Common mistakes and best practices in recycling",
    thumbnail: "/placeholder.jpg",
    videoUrl: "https://www.youtube.com/embed/pdChriDqNL8?si=ajF3CAzLhglPcNdW",
    duration: "6:45"
  },
  {
    id: 4,
    title: "Importance of Waste Segregation",
    description: "Understanding Why Waste Segregation is even important?",
    thumbnail: "/placeholder.jpg",
    videoUrl: "https://www.youtube.com/embed/0ZiD_Lb3Tm0?si=xa_gESz1OIrM1jiO",
    duration: "7:20"
  }
]

export const wasteGuide: WasteGuideItem[] = [
  {
    category: "Wet Waste",
    icon: Droplets,
    color: "bg-green-100 text-green-800",
    items: [
      "Kitchen waste (vegetable peels, food scraps)",
      "Tea leaves and coffee grounds",
      "Eggshells and nutshells",
      "Garden waste (leaves, grass clippings)",
      "Paper towels and tissues (used)"
    ],
    tips: "Keep wet waste separate and dry. Compost when possible."
  },
  {
    category: "Recyclable Waste",
    icon: Recycle,
    color: "bg-blue-100 text-blue-800",
    items: [
      "Paper and cardboard (clean and dry)",
      "Glass bottles and jars",
      "Metal cans and aluminum foil",
      "Plastic bottles and containers",
      "Textiles and clothing"
    ],
    tips: "Clean and dry recyclables before disposal. Check local recycling guidelines."
  },
  {
    category: "Non-Recyclable Waste",
    icon: X,
    color: "bg-red-100 text-red-800",
    items: [
      "Plastic bags and wrappers",
      "Styrofoam and polystyrene",
      "Broken glass and ceramics",
      "Used diapers and sanitary products",
      "Hazardous waste (batteries, chemicals)"
    ],
    tips: "Minimize non-recyclable waste. Consider alternatives to single-use items."
  }
]

export const quizQuestions: QuizQuestion[] = [
  {
    question: "Which of the following should go in wet waste?",
    options: [
      "Plastic water bottle",
      "Banana peel",
      "Aluminum can",
      "Glass jar"
    ],
    correct: 1,
    explanation: "Banana peels are organic waste and should go in wet waste for composting."
  },
  {
    question: "What should you do with recyclable items before disposal?",
    options: [
      "Throw them directly in the bin",
      "Clean and dry them",
      "Mix them with wet waste",
      "Break them into pieces"
    ],
    correct: 1,
    explanation: "Recyclables should be clean and dry to ensure proper processing."
  },
  {
    question: "Which item is NOT recyclable?",
    options: [
      "Clean paper",
      "Glass bottle",
      "Plastic bag",
      "Aluminum can"
    ],
    correct: 2,
    explanation: "Plastic bags are typically not accepted in curbside recycling programs."
  },
  {
    question: "What is the best way to handle kitchen waste?",
    options: [
      "Mix with all other waste",
      "Compost at home",
      "Throw in regular trash",
      "Burn it"
    ],
    correct: 1,
    explanation: "Composting kitchen waste reduces landfill waste and creates nutrient-rich soil."
  }
] 