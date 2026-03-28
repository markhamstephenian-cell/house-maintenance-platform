import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { FREQUENCY_DAYS } from "@/lib/default-tasks";

function getHouseId(slug: string): string | null {
  const db = getDb();
  const house = db.prepare("SELECT id FROM houses WHERE slug = ?").get(slug) as { id: string } | undefined;
  return house?.id || null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; taskId: string }> }
) {
  const { slug, taskId } = await params;
  const houseId = getHouseId(slug);
  if (!houseId) return NextResponse.json({ error: "House not found" }, { status: 404 });

  const body = await request.json();
  const db = getDb();

  const existing = db.prepare("SELECT * FROM tasks WHERE id = ? AND house_id = ?").get(taskId, houseId);
  if (!existing) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  const { name, frequency, notes, purchase_link, contractor_id, last_completed_date } = body;

  let nextDue: string | null = null;
  const freq = frequency || (existing as { frequency: string }).frequency;
  if (last_completed_date) {
    const d = new Date(last_completed_date);
    d.setDate(d.getDate() + (FREQUENCY_DAYS[freq as keyof typeof FREQUENCY_DAYS] || 30));
    nextDue = d.toISOString().split("T")[0];
  } else if ((existing as { next_due_date: string | null }).next_due_date) {
    nextDue = (existing as { next_due_date: string }).next_due_date;
  }

  db.prepare(
    `UPDATE tasks SET name = ?, frequency = ?, last_completed_date = ?, next_due_date = ?,
     notes = ?, purchase_link = ?, contractor_id = ?, updated_at = datetime('now')
     WHERE id = ? AND house_id = ?`
  ).run(
    name || (existing as { name: string }).name,
    freq,
    last_completed_date || (existing as { last_completed_date: string | null }).last_completed_date,
    nextDue,
    notes !== undefined ? notes : (existing as { notes: string | null }).notes,
    purchase_link !== undefined ? purchase_link : (existing as { purchase_link: string | null }).purchase_link,
    contractor_id !== undefined ? contractor_id : (existing as { contractor_id: string | null }).contractor_id,
    taskId,
    houseId
  );

  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);
  return NextResponse.json(task);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; taskId: string }> }
) {
  const { slug, taskId } = await params;
  const houseId = getHouseId(slug);
  if (!houseId) return NextResponse.json({ error: "House not found" }, { status: 404 });

  const db = getDb();
  const result = db.prepare("DELETE FROM tasks WHERE id = ? AND house_id = ?").run(taskId, houseId);
  if (result.changes === 0) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
