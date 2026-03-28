import { NextRequest, NextResponse } from "next/server";
import { getTodos, addTodo } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getTodos());
}

export async function POST(req: NextRequest) {
  const { title } = await req.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const todo = addTodo(title.trim());
  return NextResponse.json(todo, { status: 201 });
}
