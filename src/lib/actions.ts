"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function validateTodo(todoText: string) {
  try {
    const prompt = `
      You are a todo list validator. Analyze the following todo item and determine if it's valid.
      A valid todo item should be:
      1. Specific and clear
      2. Actionable (something that can be completed)
      3. Not too vague
      4. Not too broad or containing multiple tasks
      
      Todo: "${todoText}"
      
      Respond with a JSON object containing:
      1. "isValid": boolean (true if the todo is valid, false otherwise)
      2. "feedback": a short, helpful message explaining why the todo is valid or how it could be improved
    `

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt,
    })

    // Parse the response
    const result = JSON.parse(text)
    return {
      isValid: result.isValid,
      feedback: result.feedback,
    }
  } catch (error) {
    console.error("Error validating todo:", error)
    return {
      isValid: true, // Fallback to accepting the todo if validation fails
      feedback: "Validation service unavailable, but your todo was added.",
    }
  }
}

