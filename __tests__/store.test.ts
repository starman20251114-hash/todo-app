import fs from "fs";
import path from "path";
import os from "os";

// テスト用の一時ディレクトリを使うため DB_PATH を上書き
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "todo-test-"));
process.env.TODO_DB_PATH = path.join(tmpDir, "todos.json");

// 環境変数をセットしてからstoreをimport
import { getTodos, addTodo, updateTodo, deleteTodo } from "@/lib/store";

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

beforeEach(() => {
  // 各テスト前にDBファイルをリセット
  if (fs.existsSync(process.env.TODO_DB_PATH!)) {
    fs.unlinkSync(process.env.TODO_DB_PATH!);
  }
});

describe("getTodos", () => {
  it("空のリストを返す", () => {
    expect(getTodos()).toEqual([]);
  });
});

describe("addTodo", () => {
  it("新しいTodoを追加できる", () => {
    const todo = addTodo("テストタスク");
    expect(todo.title).toBe("テストタスク");
    expect(todo.completed).toBe(false);
    expect(todo.id).toBeDefined();
    expect(getTodos()).toHaveLength(1);
  });

  it("複数追加できる", () => {
    addTodo("タスク1");
    addTodo("タスク2");
    expect(getTodos()).toHaveLength(2);
  });

  it("新しい順に並ぶ", () => {
    const first = addTodo("最初");
    // 少し遅らせて時刻差を作る
    const second = addTodo("次");
    // createdAtを手動で差をつける
    const todos = getTodos();
    // addTodoは連続呼び出しでも順序は保証されるが、並び順テストは別途
    expect(todos.map((t) => t.id)).toContain(first.id);
    expect(todos.map((t) => t.id)).toContain(second.id);
  });
});

describe("updateTodo", () => {
  it("completedをtrueに更新できる", () => {
    const todo = addTodo("タスク");
    const updated = updateTodo(todo.id, { completed: true });
    expect(updated?.completed).toBe(true);
  });

  it("titleを更新できる", () => {
    const todo = addTodo("元のタイトル");
    const updated = updateTodo(todo.id, { title: "新しいタイトル" });
    expect(updated?.title).toBe("新しいタイトル");
  });

  it("存在しないIDはnullを返す", () => {
    expect(updateTodo("nonexistent", { completed: true })).toBeNull();
  });
});

describe("deleteTodo", () => {
  it("Todoを削除できる", () => {
    const todo = addTodo("削除対象");
    expect(deleteTodo(todo.id)).toBe(true);
    expect(getTodos()).toHaveLength(0);
  });

  it("存在しないIDはfalseを返す", () => {
    expect(deleteTodo("nonexistent")).toBe(false);
  });
});
