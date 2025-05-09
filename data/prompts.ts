import type { Prompt } from "@/types/prompt"

export const promptsData: Prompt[] = [
  {
    id: "1",
    title: "Environmental Impact Calculator",
    description: "Estimate the environmental impact of various activities or products based on user input.",
    content: `You are an environmental impact calculator. I will provide details about an activity or product, and you will:
1. Calculate the estimated carbon footprint in CO2 equivalent
2. Analyze water usage impact
3. Evaluate waste generation
4. Suggest 3 specific ways to reduce the environmental impact
5. Compare the impact to everyday activities for context

Please provide your analysis in a structured format with clear sections and quantitative estimates where possible.`,
    categories: ["sustainability", "carbon footprint", "environmental analysis"],
    rating: 85,
    analysis:
      "This prompt provides clear instructions and structure for the AI to follow, resulting in consistent and useful environmental impact assessments.",
    strengths: [
      "Clear structure with numbered steps",
      "Requests quantitative estimates for better decision-making",
      "Includes actionable suggestions for improvement",
      "Adds contextual comparisons for better understanding",
    ],
    weaknesses: [
      "Could specify more parameters for more accurate calculations",
      "Might benefit from industry-specific variations",
    ],
    instructions:
      "Provide specific details about the activity or product you want to analyze, including quantity, duration, or other relevant metrics.",
    example: `Environmental Impact Analysis: Manufacturing 1000 cotton t-shirts

Carbon Footprint:
- Estimated 10,500 kg CO2e total
- Breakdown: Cotton cultivation (40%), Manufacturing (35%), Transportation (15%), Retail & Disposal (10%)

Water Usage Impact:
- Approximately 2.7 million liters of water
- Equivalent to the drinking water of 3,700 people for one day
- Primary impact in cotton growing regions, potentially contributing to water scarcity

Waste Generation:
- Fabric waste: ~150kg during cutting and manufacturing
- Chemical waste: ~50kg from dyeing processes
- Packaging waste: ~75kg from retail and distribution

Recommendations:
1. Switch to organic or recycled cotton to reduce water usage by up to 90% and eliminate pesticide use
2. Implement closed-loop water systems in the dyeing process to reduce water consumption by 40%
3. Optimize cutting patterns to reduce fabric waste by 15-20%

Contextual Comparison:
The total carbon footprint is equivalent to driving an average car for approximately 40,000 miles or the annual carbon absorption of 500 mature trees.`,
    createdBy: "Environmental Team",
    createdAt: "2023-09-15",
    updatedAt: "2023-11-02",
  },
  {
    id: "2",
    title: "Personalized Fitness Plan Generator",
    description: "Create customized workout plans based on user goals, fitness level, and available equipment.",
    content: `As a professional fitness coach, create a personalized fitness plan based on the following information:

Goal: [User's fitness goal]
Current fitness level: [Beginner/Intermediate/Advanced]
Available equipment: [List equipment or specify "bodyweight only"]
Time available: [Minutes per session, days per week]
Any injuries or limitations: [Specify if any]

Your response should include:
1. A weekly workout schedule with specific exercises, sets, reps, and rest periods
2. Progression plan for 4 weeks
3. Warm-up and cool-down routines
4. Nutrition tips aligned with the fitness goal
5. Recovery recommendations

Format the workout plan in an organized, easy-to-follow structure with clear headings and sections.`,
    categories: ["fitness", "health", "personalization"],
    rating: 92,
    analysis:
      "This prompt effectively structures the input parameters needed and clearly outlines the expected output format, resulting in highly personalized and actionable fitness plans.",
    strengths: [
      "Clear input parameters for personalization",
      "Comprehensive output requirements",
      "Includes progression planning for sustainability",
      "Addresses nutrition and recovery aspects",
    ],
    weaknesses: ["Could include request for visual demonstrations or form tips"],
    instructions: "Fill in the bracketed information with your specific details to receive a customized fitness plan.",
    example: `PERSONALIZED 4-WEEK FITNESS PLAN

CLIENT PROFILE:
- Goal: Build muscle while losing fat
- Fitness Level: Intermediate
- Equipment: Dumbbells, resistance bands, pull-up bar
- Time Available: 45 minutes, 4 days per week
- Limitations: Previous shoulder injury

WEEKLY SCHEDULE:
Monday: Upper Body Focus
Wednesday: Lower Body Focus
Friday: Full Body Strength
Saturday: HIIT & Core

WEEK 1 DETAILED PLAN:

MONDAY - UPPER BODY:
Warm-up: 5 min dynamic stretching + 5 min light cardio
Main Workout:
1. Modified Push-ups: 3 sets x 12 reps (avoid full shoulder extension)
2. Dumbbell Rows: 3 sets x 10 reps each side
3. Lateral Raises: 3 sets x 12 reps (light weight)
4. Bicep Curls: 3 sets x 12 reps
5. Tricep Dips: 3 sets x 10 reps
Rest: 60 seconds between sets
Cool-down: 5 min static stretching focusing on chest and back

[Additional days and weeks would follow in the same detailed format]

NUTRITION RECOMMENDATIONS:
1. Protein intake: 1.6-1.8g per kg of bodyweight
2. Slight caloric deficit of 300-500 calories below maintenance
3. Focus on whole foods with emphasis on lean protein sources
4. Pre-workout meal: Complex carbs + protein 1-2 hours before training
5. Post-workout: Protein shake within 30 minutes + balanced meal within 2 hours

RECOVERY STRATEGIES:
1. Ensure 7-8 hours of quality sleep nightly
2. Implement active recovery on rest days (walking, light stretching)
3. Pay special attention to shoulder mobility exercises
4. Consider foam rolling for muscle recovery
5. Progressive overload: Increase weight by 5% or add 1-2 reps each week as form allows`,
    createdBy: "Fitness Team",
    createdAt: "2023-10-05",
    updatedAt: "2023-12-10",
  },
  {
    id: "3",
    title: "Code Refactoring Advisor",
    description:
      "Analyze code snippets and provide suggestions for improving code quality, readability, and efficiency.",
    content: `As a senior software engineer specializing in code quality, analyze the following code snippet and provide refactoring recommendations:

\`\`\`
[PASTE CODE HERE]
\`\`\`

Please provide your analysis in the following format:

1. Code Quality Assessment:
   - Overall evaluation
   - Potential bugs or edge cases
   - Performance concerns

2. Refactoring Recommendations:
   - Structural improvements
   - Readability enhancements
   - Performance optimizations
   - Design pattern suggestions

3. Refactored Code:
   - Provide a clean, refactored version of the code with comments explaining key changes

4. Additional Best Practices:
   - Testing suggestions
   - Documentation recommendations
   - Maintenance considerations`,
    categories: ["software development", "code quality", "programming"],
    rating: 88,
    analysis:
      "This prompt provides a clear structure for code review and refactoring, ensuring comprehensive feedback that addresses multiple aspects of code quality.",
    strengths: [
      "Structured format ensures comprehensive analysis",
      "Requests both feedback and concrete solutions",
      "Includes considerations beyond just the code itself",
      "Adaptable to different programming languages",
    ],
    weaknesses: [
      "Could benefit from language-specific variations",
      "Might need adjustment for very large code snippets",
    ],
    instructions:
      "Replace [PASTE CODE HERE] with the code snippet you want to refactor. Specify the programming language if it's not obvious from the syntax.",
    createdBy: "Development Team",
    createdAt: "2023-08-20",
    updatedAt: "2024-01-15",
  },
  {
    id: "4",
    title: "Product Description Optimizer",
    description: "Enhance product descriptions for e-commerce platforms, focusing on key features and benefits.",
    content: `As an e-commerce copywriting specialist, optimize the following product description to increase conversions:

Original Product Description:
[ORIGINAL DESCRIPTION]

Product Category: [CATEGORY]
Target Audience: [AUDIENCE]
Key Selling Points: [LIST 3-5 POINTS]
Brand Voice: [CASUAL/PROFESSIONAL/LUXURY/ETC]
Word Count Limit: [NUMBER] words

Please rewrite the product description to:
1. Create a compelling headline that includes primary keywords
2. Highlight key features and their benefits to the customer
3. Use persuasive language that resonates with the target audience
4. Include a clear call-to-action
5. Optimize for SEO while maintaining natural language
6. Match the specified brand voice and word count`,
    categories: ["e-commerce", "copywriting", "marketing"],
    rating: 90,
    analysis:
      "This prompt effectively structures the input needed for context and provides clear guidelines for the output, resulting in product descriptions that are both SEO-friendly and conversion-focused.",
    strengths: [
      "Comprehensive input parameters for context",
      "Clear output requirements with numbered points",
      "Balances SEO needs with persuasive copywriting",
      "Adaptable to different product types and brand voices",
    ],
    weaknesses: [
      "Could include request for bullet point format option",
      "Might benefit from examples of tone/voice for clarity",
    ],
    instructions:
      "Replace the bracketed sections with your product information. Be specific about your target audience and key selling points for best results.",
    createdBy: "Marketing Team",
    createdAt: "2023-11-12",
    updatedAt: "2024-02-05",
  },
  {
    id: "5",
    title: "AI Implementation Roadmap Generator",
    description:
      "Create a customized roadmap for implementing AI solutions in a business based on specific needs and constraints.",
    content: `As an AI implementation consultant for Curve AI Solutions, create a detailed roadmap for implementing AI solutions in a business with the following characteristics:

Industry: [INDUSTRY]
Company Size: [NUMBER] employees
Current Tech Infrastructure: [BASIC/INTERMEDIATE/ADVANCED]
Data Maturity: [LOW/MEDIUM/HIGH]
Primary Business Goals: [LIST GOALS]
Budget Range: [RANGE]
Timeline Expectations: [TIMEFRAME]

Your roadmap should include:

1. Assessment Phase:
   - Key areas to evaluate
   - Recommended tools for data audit
   - Success metrics to establish

2. Planning Phase:
   - Prioritized use cases specific to the industry
   - Required infrastructure upgrades
   - Team skills assessment and training needs

3. Implementation Timeline:
   - 30-day quick wins
   - 90-day foundation building
   - 6-month major milestones
   - 12-month transformation goals

4. Resource Requirements:
   - Estimated budget allocation by category
   - Internal team requirements
   - Recommended external partnerships

5. Risk Management:
   - Potential implementation challenges
   - Mitigation strategies
   - Compliance and ethical considerations

Format this as a professional consulting deliverable with clear sections, bullet points for actionable items, and specific recommendations rather than generalities.`,
    categories: ["ai implementation", "business strategy", "digital transformation"],
    rating: 95,
    analysis:
      "This prompt is highly effective for generating customized AI implementation roadmaps that are specific to a client's industry, size, and needs.",
    strengths: [
      "Comprehensive input parameters for customization",
      "Clear structure for the output roadmap",
      "Includes both short-term and long-term planning",
      "Addresses practical aspects like budget and risk management",
    ],
    weaknesses: [
      "Could include request for visual timeline representation",
      "Might benefit from case study references",
    ],
    instructions:
      "Replace the bracketed information with your specific business details. Be as specific as possible about your current tech infrastructure and business goals.",
    createdBy: "Strategy Team",
    createdAt: "2024-01-10",
    updatedAt: "2024-03-01",
  },
]
