import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { FREQUENCY_DAYS } from "@/lib/default-tasks";
import { v4 as uuid } from "uuid";

function getHouseId(slug: string): string | null {
  const db = getDb();
  const house = db.prepare("SELECT id FROM houses WHERE slug = ?").get(slug) as { id: string } | undefined;
  return house?.id || null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const houseId = getHouseId(slug);
  if (!houseId) return NextResponse.json({ error: "House not found" }, { status: 404 });

  const body = await request.json();
  const { name, frequency, notes, purchase_link, contractor_id, last_completed_date } = body;

  if (!name || !frequency) {
    return NextResponse.json({ error: "Name and frequency are required" }, { status: 400 });
  }

  let nextDue: string | null = null;
  if (last_completed_date) {
    const d = new Date(last_completed_date);
    d.setDate(d.getDate() + (FREQUENCY_DAYS[frequency as keyof typeof FREQUENCY_DAYS] || 30));
    nextDue = d.toISOString().split("T")[0];
  } else {
    const d = new Date();
    d.setDate(d.getDate() + (FREQUENCY_DAYS[frequency as keyof typeof FREQUENCY_DAYS] || 30));
    nextDue = d.toISOString().split("T")[0];
  }

  const id = uuid();
  const db = getDb();
  db.prepare(
    `INSERT INTO tasks (id, house_id, name, frequency, last_completed_date, next_due_date, notes, purchase_link, contractor_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, houseId, name, frequency, last_completed_date || null, nextDue, notes || null, purchase_link || null, contractor_id || null);

  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  return NextResponse.json(task, { status: 201 });
}
