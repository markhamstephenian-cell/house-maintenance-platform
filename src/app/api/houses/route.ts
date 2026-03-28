import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { generateSlug } from "@/lib/slug";
import { DEFAULT_TASKS, FREQUENCY_DAYS } from "@/lib/default-tasks";
import { v4 as uuid } from "uuid";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const address = body.address?.trim();

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  const db = getDb();
  const slug = generateSlug(address);
  const houseId = uuid();

  db.prepare(
    "INSERT INTO houses (id, address, slug) VALUES (?, ?, ?)"
  ).run(houseId, address, slug);

  // Insert default tasks
  const insertTask = db.prepare(
    `INSERT INTO tasks (id, house_id, name, frequency, notes, purchase_link, next_due_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const today = new Date();
  const insertMany = db.transaction(() => {
    for (const task of DEFAULT_TASKS) {
      const daysUntilDue = FREQUENCY_DAYS[task.frequency];
      const nextDue = new Date(today);
      nextDue.setDate(nextDue.getDate() + daysUntilDue);

      insertTask.run(
        uuid(),
        houseId,
        task.name,
        task.frequency,
        task.notes || null,
        task.purchase_link || null,
        nextDue.toISOString().split("T")[0]
      );
    }
  });
  insertMany();

  return NextResponse.json({ slug }, { status: 201 });
}
