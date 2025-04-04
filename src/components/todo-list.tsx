"use client"

import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Todo {
  id: number
  text: string
  completed: boolean
  feedback?: string
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    // Load todos from localStorage
    const loadTodos = () => {
      const storedTodos = localStorage.getItem("todos")
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos))
      }
    }

    loadTodos()

    // Listen for changes to localStorage
    window.addEventListener("storage", loadTodos)

    return () => {
      window.removeEventListener("storage", loadTodos)
    }
  }, [])

  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    setTodos(updatedTodos)
    localStorage.setItem("todos", JSON.stringify(updatedTodos))
  }

  const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id)
    setTodos(updatedTodos)
    localStorage.setItem("todos", JSON.stringify(updatedTodos))
  }

  if (todos.length === 0) {
    return <div className="text-center py-8 text-gray-500">No todos yet. Add one above!</div>
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={`flex items-start justify-between p-4 rounded-md border ${
            todo.completed ? "bg-gray-50" : "bg-white"
          }`}
        >
          <div className="flex items-start gap-3">
            <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} className="mt-1" />
            <div>
              <p className={todo.completed ? "line-through text-gray-500" : ""}>{todo.text}</p>
              {todo.feedback && (
                <Badge variant="outline" className="mt-1 text-xs font-normal">
                  {todo.feedback}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteTodo(todo.id)}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  )
}

