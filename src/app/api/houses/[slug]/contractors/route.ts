import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { v4 as uuid } from "uuid";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const db = getDb();

  const house = db.prepare("SELECT id FROM houses WHERE slug = ?").get(slug) as { id: string } | undefined;
  if (!house) return NextResponse.json({ error: "House not found" }, { status: 404 });

  const body = await request.json();
  const { name, service_type, phone, email, website, notes } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const id = uuid();
  db.prepare(
    `INSERT INTO contractors (id, house_id, name, service_type, phone, email, website, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, house.id, name, service_type || "", phone || "", email || "", website || null, notes || null);

  const contractor = db.prepare("SELECT * FROM contractors WHERE id = ?").get(id);
  return NextResponse.json(contractor, { status: 201 });
}
