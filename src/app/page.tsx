import TodoList from "@/components/todo-list"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">AI Todo Validator</h1>
          <p className="text-muted-foreground mt-2">Add your tasks and get AI feedback on how well-defined they are</p>
        </div>
        <TodoList />
      </div>
    </main>
  )
}

