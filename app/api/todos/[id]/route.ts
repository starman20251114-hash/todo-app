import { NextRequest, NextResponse } from "next/server";
import { updateTodo, deleteTodo } from "@/lib/store";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patch = await req.json();
  const todo = updateTodo(id, patch);
  if (!todo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(todo);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = deleteTodo(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
