export async function validateTodo(todoText: string) {
  try {
    const response = await fetch("/api/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todoText }),
    })

    if (!response.ok) {
      throw new Error("Failed to validate todo")
    }

    return await response.json()
  } catch (error) {
    console.error("Error validating todo:", error)
    return {
      isValid: false,
      feedback: "Unable to validate this todo item. Please try again.",
    }
  }
}

