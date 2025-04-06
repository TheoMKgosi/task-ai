"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle, Send } from "lucide-react"
import { validateTodo } from "@/lib/validate-todo"

type Todo = {
  id: string
  text: string
  completed: boolean
  validationStatus: "pending" | "validating" | "valid" | "invalid"
  feedback?: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [isValidating, setIsValidating] = useState(false)

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTodo.trim()) return

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      validationStatus: "validating",
    }

    setTodos([...todos, todo])
    setNewTodo("")
    setIsValidating(true)

    try {
      const validation = await validateTodo(newTodo)

      setTodos((prev) =>
        prev.map((t) =>
          t.id === todo.id
            ? {
                ...t,
                validationStatus: validation.isValid ? "valid" : "invalid",
                feedback: validation.feedback,
              }
            : t,
        ),
      )
    } catch (error) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todo.id
            ? {
                ...t,
                validationStatus: "invalid",
                feedback: "Failed to validate this todo item.",
              }
            : t,
        ),
      )
    } finally {
      setIsValidating(false)
    }
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddTodo} className="flex space-x-2">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            disabled={isValidating}
          />
          <Button type="submit" disabled={isValidating || !newTodo.trim()}>
            {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>

        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No tasks yet. Add one to get started!</p>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className="flex items-start justify-between p-3 border rounded-md">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="h-4 w-4"
                    />
                    <span className={todo.completed ? "line-through text-muted-foreground" : ""}>{todo.text}</span>
                    {todo.validationStatus === "validating" && (
                      <Badge variant="outline" className="ml-2 animate-pulse">
                        Validating...
                      </Badge>
                    )}
                    {todo.validationStatus === "valid" && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
                        <CheckCircle className="h-3 w-3 mr-1" /> Valid
                      </Badge>
                    )}
                    {todo.validationStatus === "invalid" && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 ml-2">
                        <AlertCircle className="h-3 w-3 mr-1" /> Needs Improvement
                      </Badge>
                    )}
                  </div>
                  {todo.feedback && (
                    <p className={`text-sm ${todo.validationStatus === "valid" ? "text-green-600" : "text-red-600"}`}>
                      {todo.feedback}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {todos.filter((t) => t.completed).length} of {todos.length} tasks completed
      </CardFooter>
    </Card>
  )
}

