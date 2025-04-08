import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { todoText } = await request.json()

    if (!todoText || typeof todoText !== "string") {
      return NextResponse.json({ error: "Todo text is required" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        isValid: z.boolean().describe("Whether the todo item is well-formed and specific enough"),
        feedback: z.string().describe("Constructive feedback about the todo item"),
      }),
      prompt: `
        Analyze this todo item: "${todoText}"
        
        Determine if it's a well-formed, specific, and actionable task.
        
        A good todo item should:
        - Be clear and specific
        - Be actionable (start with a verb when possible)
        - Have a defined scope
        - Be realistic and achievable
        - Ideally include a timeframe or deadline if applicable
        
        Provide constructive feedback to improve the todo item if needed.
      `,
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("Error validating todo:", error)
    return NextResponse.json({ error: "Failed to validate todo" }, { status: 500 })
  }
}

