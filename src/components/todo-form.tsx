"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { validateTodo } from "@/lib/actions"
import { Loader2 } from "lucide-react"

export function TodoForm() {
  const [todo, setTodo] = useState("")
  const [isValidating, setIsValidating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!todo.trim()) return

    setIsValidating(true)

    try {
      const result = await validateTodo(todo)

      if (result.isValid) {
        // Add to local storage
        const todos = JSON.parse(localStorage.getItem("todos") || "[]")
        const newTodo = {
          id: Date.now(),
          text: todo,
          completed: false,
          feedback: result.feedback,
        }

        localStorage.setItem("todos", JSON.stringify([...todos, newTodo]))

        // Dispatch custom event to notify TodoList component
        window.dispatchEvent(new Event("storage"))

        setTodo("")
        toast(result.feedback)
      } else {
        toast(result.feedback)
      }
    } catch (error) {
      toast("Failed to validate todo")
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a new todo..."
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isValidating}>
          {isValidating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Validating
            </>
          ) : (
            "Add"
          )}
        </Button>
      </div>
    </form>
  )
}

