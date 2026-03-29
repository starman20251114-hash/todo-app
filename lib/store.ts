import fs from "fs";
import path from "path";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

const DB_PATH = process.env.TODO_DB_PATH ?? path.join(process.cwd(), "data", "todos.json");

function ensureFile() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "[]", "utf-8");
}

function readAll(): Todo[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as Todo[];
}

function writeAll(todos: Todo[]) {
  ensureFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(todos, null, 2), "utf-8");
}

export function getTodos(): Todo[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addTodo(title: string): Todo {
  const todos = readAll();
  const todo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  writeAll(todos);
  return todo;
}

export function updateTodo(
  id: string,
  patch: Partial<Pick<Todo, "title" | "completed">>
): Todo | null {
  const todos = readAll();
  const todo = todos.find((t) => t.id === id);
  if (!todo) return null;
  Object.assign(todo, patch);
  writeAll(todos);
  return todo;
}

export function deleteTodo(id: string): boolean {
  const todos = readAll();
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  writeAll(todos);
  return true;
}
