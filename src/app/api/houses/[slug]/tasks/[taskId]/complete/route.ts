import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { FREQUENCY_DAYS } from "@/lib/default-tasks";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; taskId: string }> }
) {
  const { slug, taskId } = await params;
  const db = getDb();

  const house = db.prepare("SELECT id FROM houses WHERE slug = ?").get(slug) as { id: string } | undefined;
  if (!house) return NextResponse.json({ error: "House not found" }, { status: 404 });

  const task = db.prepare("SELECT * FROM tasks WHERE id = ? AND house_id = ?").get(taskId, house.id) as {
    frequency: string;
  } | undefined;
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  // Use the client's local date to avoid UTC timezone mismatch
  let todayStr: string;
  try {
    const body = await request.json();
    todayStr = body.completedDate;
  } catch {
    todayStr = new Date().toISOString().split("T")[0];
  }
  const days = FREQUENCY_DAYS[task.frequency as keyof typeof FREQUENCY_DAYS] || 30;
  const [y, m, d] = todayStr.split("-").map(Number);
  const todayDate = new Date(y, m - 1, d);
  todayDate.setDate(todayDate.getDate() + days);
  const nextDueStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;

  db.prepare(
    `UPDATE tasks SET last_completed_date = ?, next_due_date = ?, updated_at = datetime('now')
     WHERE id = ? AND house_id = ?`
  ).run(todayStr, nextDueStr, taskId, house.id);

  const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);
  return NextResponse.json(updated);
}
