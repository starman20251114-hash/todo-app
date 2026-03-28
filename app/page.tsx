"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const res = await fetch("/api/todos");
    setTodos(await res.json());
  }

  async function addTodo() {
    if (!input.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input.trim() }),
    });
    setInput("");
    fetchTodos();
  }

  async function toggleTodo(todo: Todo) {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    fetchTodos();
  }

  async function saveEdit(id: string) {
    if (!editingTitle.trim()) return;
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingTitle.trim() }),
    });
    setEditingId(null);
    fetchTodos();
  }

  async function deleteTodo(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  }

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <main className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Todo App</h1>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="新しいタスクを入力..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={addTodo}
          >
            追加
          </button>
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <p className="text-xs text-gray-500 mb-3">
            残り {remaining} / {todos.length} タスク
          </p>
        )}

        {/* List */}
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
                className="w-4 h-4 accent-blue-500 cursor-pointer"
              />

              {editingId === todo.id ? (
                <input
                  className="flex-1 border-b border-blue-400 text-sm focus:outline-none"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(todo.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                />
              ) : (
                <span
                  className={`flex-1 text-sm cursor-pointer ${
                    todo.completed ? "line-through text-gray-400" : "text-gray-700"
                  }`}
                  onDoubleClick={() => {
                    setEditingId(todo.id);
                    setEditingTitle(todo.title);
                  }}
                >
                  {todo.title}
                </span>
              )}

              {editingId === todo.id ? (
                <button
                  className="text-xs text-blue-500 hover:text-blue-700"
                  onClick={() => saveEdit(todo.id)}
                >
                  保存
                </button>
              ) : (
                <button
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  onClick={() => deleteTodo(todo.id)}
                >
                  削除
                </button>
              )}
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-12">
            タスクがありません。上から追加してください。
          </p>
        )}
      </div>
    </main>
  );
}
