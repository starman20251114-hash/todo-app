import { NextRequest } from "next/server";

jest.mock("@/lib/store", () => ({
  getTodos: jest.fn(),
  addTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
}));

import * as store from "@/lib/store";
const mockStore = store as jest.Mocked<typeof store>;

function makeRequest(body?: unknown, method = "GET"): NextRequest {
  return new NextRequest("http://localhost/api/todos", {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: { "Content-Type": "application/json" },
  });
}

describe("GET /api/todos", () => {
  it("Todoリストを返す", async () => {
    const todos = [{ id: "1", title: "テスト", completed: false, createdAt: "" }];
    mockStore.getTodos.mockReturnValue(todos);
    const { GET } = await import("@/app/api/todos/route");

    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(todos);
  });
});

describe("POST /api/todos", () => {
  it("新しいTodoを作成する", async () => {
    const todo = { id: "1", title: "新タスク", completed: false, createdAt: "" };
    mockStore.addTodo.mockReturnValue(todo);
    const { POST } = await import("@/app/api/todos/route");

    const res = await POST(makeRequest({ title: "新タスク" }, "POST"));
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(todo);
  });

  it("titleが空の場合400を返す", async () => {
    const { POST } = await import("@/app/api/todos/route");
    const res = await POST(makeRequest({ title: "" }, "POST"));
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/todos/[id]", () => {
  it("Todoを更新する", async () => {
    const updated = { id: "1", title: "更新", completed: true, createdAt: "" };
    mockStore.updateTodo.mockReturnValue(updated);
    const { PUT } = await import("@/app/api/todos/[id]/route");

    const req = new NextRequest("http://localhost/api/todos/1", {
      method: "PUT",
      body: JSON.stringify({ completed: true }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(updated);
  });

  it("存在しないIDは404を返す", async () => {
    mockStore.updateTodo.mockReturnValue(null);
    const { PUT } = await import("@/app/api/todos/[id]/route");

    const req = new NextRequest("http://localhost/api/todos/bad", {
      method: "PUT",
      body: JSON.stringify({ completed: true }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req, { params: Promise.resolve({ id: "bad" }) });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/todos/[id]", () => {
  it("Todoを削除する", async () => {
    mockStore.deleteTodo.mockReturnValue(true);
    const { DELETE } = await import("@/app/api/todos/[id]/route");

    const req = new NextRequest("http://localhost/api/todos/1", { method: "DELETE" });
    const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(204);
  });

  it("存在しないIDは404を返す", async () => {
    mockStore.deleteTodo.mockReturnValue(false);
    const { DELETE } = await import("@/app/api/todos/[id]/route");

    const req = new NextRequest("http://localhost/api/todos/bad", { method: "DELETE" });
    const res = await DELETE(req, { params: Promise.resolve({ id: "bad" }) });
    expect(res.status).toBe(404);
  });
});
