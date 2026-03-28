import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { FREQUENCY_DAYS } from "@/lib/default-tasks";

export async function POST(
  _request: NextRequest,
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

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const days = FREQUENCY_DAYS[task.frequency as keyof typeof FREQUENCY_DAYS] || 30;
  const nextDue = new Date(today);
  nextDue.setDate(nextDue.getDate() + days);
  const nextDueStr = nextDue.toISOString().split("T")[0];

  db.prepare(
    `UPDATE tasks SET last_completed_date = ?, next_due_date = ?, updated_at = datetime('now')
     WHERE id = ? AND house_id = ?`
  ).run(todayStr, nextDueStr, taskId, house.id);

  const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);
  return NextResponse.json(updated);
}
