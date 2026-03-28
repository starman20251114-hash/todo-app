export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

const todos: Todo[] = [];

export function getTodos(): Todo[] {
  return [...todos].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addTodo(title: string): Todo {
  const todo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  return todo;
}

export function updateTodo(
  id: string,
  patch: Partial<Pick<Todo, "title" | "completed">>
): Todo | null {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return null;
  Object.assign(todo, patch);
  return todo;
}

export function deleteTodo(id: string): boolean {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}
