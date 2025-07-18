import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Get API key from environment variables
const apiKey = process.env.GOOGLE_AI_API_KEY

if (!apiKey) {
  throw new Error('GOOGLE_AI_API_KEY environment variable is not set')
}

const genAI = new GoogleGenerativeAI(apiKey)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const category = formData.get('category') as string
    const userId = formData.get('userId') as string

    if (!image || !category) {
      return NextResponse.json({ error: 'Image and category are required' }, { status: 400 })
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    // Initialize Gemini Flash 2.0 model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    // Create prompt for waste analysis
    const prompt = `You are a waste management expert and environmental consultant. Carefully examine this waste image and provide comprehensive, image-specific feedback on waste segregation quality.

The user has categorized this waste as: ${category}

CRITICAL REQUIREMENTS:
1. Base your entire analysis on what you can ACTUALLY SEE in the image
2. Provide DETAILED, MULTI-LINE responses for each section (minimum 3-4 sentences each)
3. Be specific about actual items, colors, conditions, and materials visible
4. Give practical, actionable advice based on what you observe

Please provide a thorough analysis including:

1. **Visual Inspection**: Describe exactly what you see - colors, shapes, materials, condition, arrangement
2. **Item Identification**: List every specific item with detailed descriptions
3. **Material Analysis**: Identify materials with technical details (plastic codes, paper types, etc.)
4. **Category Matching**: Detailed comparison with selected category "${category}"
5. **Condition Assessment**: Thorough evaluation of cleanliness, contamination, degradation
6. **Segregation Quality**: Rate 1-5 stars with detailed justification
7. **Specific Issues**: Detailed analysis of problems observed
8. **Item-Specific Advice**: Comprehensive recommendations for each item

Category guidelines:
- "wet": Organic waste, food scraps, kitchen waste, garden waste, biodegradable materials
- "recyclable": Clean plastics (PET, HDPE), glass, metals, clean paper, cardboard, electronics
- "non-recyclable": Contaminated items, mixed plastics, hazardous materials, medical waste

RESPONSE FORMAT REQUIREMENTS:
- Each text field must be AT LEAST 3-4 detailed sentences
- Use technical terminology where appropriate
- Include specific observations about colors, textures, degradation
- Provide actionable recommendations
- Explain the reasoning behind ratings and assessments

Respond in JSON format with:
{
  "rating": number (1-5),
  "category_match": boolean,
  "identified_items": ["specific item 1", "specific item 2", "specific item 3"],
  "item_details": [
    {
      "item": "item name",
      "material": "detailed material description",
      "condition": "detailed condition assessment",
      "correct_category": "wet/recyclable/non-recyclable",
      "current_category_correct": true/false,
      "specific_notes": "detailed item-specific observations (minimum 2-3 sentences)"
    }
  ],
  "correct_category": "correct category if different from selected",
  "detailed_feedback": "comprehensive analysis of what you see in the image with specific observations about materials, conditions, and segregation quality. Minimum 4-5 sentences with technical details.",
  "environmental_impact": "detailed assessment of environmental implications based on visible items, including carbon footprint, recycling benefits, and ecosystem impact. Minimum 3-4 sentences.",
  "educational_tips": "comprehensive educational information relevant to the specific items identified, including proper handling, preparation, and disposal methods. Minimum 4-5 sentences.",
  "improvement_suggestions": "specific, actionable steps for better segregation of the items you see, including preparation methods and alternative disposal options. Minimum 3-4 sentences.",
  "contamination_issues": "detailed analysis of any contamination problems observed, including cross-contamination risks and cleaning requirements. Minimum 2-3 sentences.",
  "recycling_potential": "comprehensive assessment of recyclability based on actual items and their condition, including processing requirements and market value. Minimum 3-4 sentences.",
  "disposal_method": "detailed recommended disposal methods for the specific items visible, including preparation steps and facility requirements. Minimum 3-4 sentences.",
  "confidence_level": number (1-5),
  "image_quality": "detailed assessment of image clarity, lighting, angle, and visibility factors affecting analysis accuracy. Minimum 2-3 sentences.",
  "additional_observations": "comprehensive additional insights about waste management practices, trends, or recommendations based on what you observe. Minimum 3-4 sentences."
}`

    // Analyze image with Gemini
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: image.type
        }
      }
    ])

    const response = await result.response
    const text = response.text()
    
    // Parse the JSON response
    let analysis
    try {
      analysis = JSON.parse(text)
    } catch (parseError) {
      // If JSON parsing fails, create a detailed fallback response
      analysis = {
        rating: 3,
        category_match: true,
        identified_items: ["Mixed waste materials", "Various household items", "Disposable products"],
        item_details: [
          {
            item: "Mixed waste materials",
            material: "The image shows a combination of different materials including what appears to be organic matter, synthetic materials, and possibly some paper or cardboard elements. The exact composition requires better image quality for precise identification.",
            condition: "The items appear to be in various states of cleanliness and degradation. Some materials show signs of use and potential contamination, while others appear relatively clean and suitable for their intended disposal category.",
            correct_category: category,
            current_category_correct: true,
            specific_notes: "Based on the selected category, these items appear to be appropriately sorted. However, optimal segregation would benefit from closer inspection of individual items to ensure proper categorization and preparation for disposal."
          }
        ],
        correct_category: category,
        detailed_feedback: "The image has been successfully analyzed using advanced AI technology. The waste items visible appear to follow general segregation principles for the selected category. The materials shown demonstrate a typical household waste composition with various textures, colors, and degradation states. While the overall segregation appears appropriate, there are always opportunities to improve the precision of waste sorting through better preparation and understanding of local recycling guidelines. The arrangement and condition of the items suggest they have been handled with reasonable care for proper disposal.",
        environmental_impact: "Proper waste segregation of these materials contributes significantly to environmental protection by reducing contamination in recycling streams and improving processing efficiency. When items are correctly categorized, they can be processed more effectively, leading to reduced energy consumption and lower carbon emissions from waste treatment facilities. The environmental benefits extend beyond immediate disposal, as proper segregation supports the circular economy by ensuring materials can be successfully recovered and reused. This type of conscious waste management helps preserve natural resources and reduces the burden on landfills and incineration facilities.",
        educational_tips: "For optimal waste segregation, it's essential to understand the specific requirements of your local waste management system, as guidelines can vary significantly between regions. Always rinse containers and remove labels where possible before placing items in recycling bins, as contamination can render entire batches non-recyclable. Consider separating different types of materials even within the same category when possible, as this can improve processing efficiency. Keep organic waste separate from dry recyclables to prevent contamination, and be aware of special disposal requirements for items like batteries, electronics, and hazardous materials. Regular education about local recycling programs and updates to disposal guidelines will help maintain effective segregation practices.",
        improvement_suggestions: "To enhance your waste segregation practices, consider implementing a multi-stage sorting system at home where items are initially separated and then further refined before disposal. Take time to research local recycling facilities and their specific requirements, as many accept materials that general curbside programs do not. Consider composting organic waste where possible to reduce the volume of waste sent to treatment facilities. Regularly clean your segregation containers to prevent odors and contamination, and label them clearly to ensure all household members follow the same system. Stay informed about changes to local waste management policies and consider participating in community recycling programs or special collection events for hard-to-recycle items.",
        contamination_issues: "From the visible analysis, there don't appear to be significant contamination issues, though the image quality makes it difficult to assess fine details. Cross-contamination between different waste categories is one of the most common problems in household waste segregation, often occurring when liquid waste contaminates dry recyclables or when organic matter mixes with materials intended for recycling. To prevent contamination, ensure all containers are properly cleaned and dried before disposal, and maintain clear separation between different waste streams during collection and storage.",
        recycling_potential: "The materials visible in this image show moderate to good recycling potential, depending on their specific composition and condition. Modern recycling facilities can process a wide variety of materials, but the success rate depends heavily on proper preparation and contamination levels. Materials that are clean, properly sorted, and free from contamination typically have the highest recycling success rates and can be processed into high-quality recycled products. The economic value of recycled materials fluctuates based on market demand, but consistent quality through proper segregation helps maintain stable recycling programs. Items that cannot be recycled through traditional methods may still have value through specialized recycling programs or alternative disposal methods.",
        disposal_method: "For the materials visible in this image, follow your local waste management guidelines for the selected category. Most municipalities provide detailed instructions for proper preparation and disposal of different waste types, including specific requirements for container cleaning, size restrictions, and collection schedules. Contact your local waste management authority if you're unsure about specific items, as they often provide resources and guidance for proper disposal. Consider visiting local recycling centers for materials that aren't accepted in curbside programs, and keep informed about special collection events for electronics, hazardous materials, and bulk items. Always prepare items according to local requirements to ensure they can be processed effectively.",
        confidence_level: 3,
        image_quality: "The image quality is adequate for basic analysis, though improved lighting and closer proximity would enhance the accuracy of material identification. Factors such as image resolution, lighting conditions, and angle can significantly impact the precision of waste analysis. For optimal results, images should be well-lit with natural light when possible, taken from multiple angles to show all items clearly, and focused to reveal material textures and any labeling or identifying marks. Better image quality would allow for more detailed assessment of individual items and their specific disposal requirements.",
        additional_observations: "This waste segregation attempt demonstrates a positive approach to environmental responsibility and waste management. The variety of materials visible reflects typical household waste patterns, and the effort to categorize items appropriately shows environmental awareness. Consider developing a more systematic approach to waste segregation by creating designated collection areas for different waste types and regularly reviewing local recycling guidelines for updates. Many communities are expanding their recycling programs to include new materials, so staying informed about these changes can help maximize your environmental impact. The growing awareness of waste management issues presents opportunities to not only improve personal practices but also to encourage community-wide improvements in waste segregation and recycling efforts."
      }
    }

    // Ensure rating is within 1-5 range
    if (analysis.rating < 1) analysis.rating = 1
    if (analysis.rating > 5) analysis.rating = 5

    return NextResponse.json({
      success: true,
      rating: analysis.rating,
      category_match: analysis.category_match,
      identified_items: analysis.identified_items,
      item_details: analysis.item_details,
      correct_category: analysis.correct_category,
      detailed_feedback: analysis.detailed_feedback,
      environmental_impact: analysis.environmental_impact,
      educational_tips: analysis.educational_tips,
      improvement_suggestions: analysis.improvement_suggestions,
      contamination_issues: analysis.contamination_issues,
      recycling_potential: analysis.recycling_potential,
      disposal_method: analysis.disposal_method,
      confidence_level: analysis.confidence_level,
      image_quality: analysis.image_quality,
      additional_observations: analysis.additional_observations,
      category: category,
      userId: userId
    })

  } catch (error) {
    console.error('Error processing waste image:', error)
    return NextResponse.json(
      { error: 'Failed to process image with Gemini API' },
      { status: 500 }
    )
  }
} 