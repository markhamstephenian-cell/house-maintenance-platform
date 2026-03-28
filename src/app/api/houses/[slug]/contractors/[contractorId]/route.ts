import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; contractorId: string }> }
) {
  const { slug, contractorId } = await params;
  const db = getDb();

  const house = db.prepare("SELECT id FROM houses WHERE slug = ?").get(slug) as { id: string } | undefined;
  if (!house) return NextResponse.json({ error: "House not found" }, { status: 404 });

  const existing = db.prepare("SELECT * FROM contractors WHERE id = ? AND house_id = ?").get(contractorId, house.id);
  if (!existing) return NextResponse.json({ error: "Contractor not found" }, { status: 404 });

  const body = await request.json();
  const ex = existing as Record<string, string | null>;

  db.prepare(
    `UPDATE contractors SET name = ?, service_type = ?, phone = ?, email = ?, website = ?, notes = ?, updated_at = datetime('now')
     WHERE id = ? AND house_id = ?`
  ).run(
    body.name ?? ex.name,
    body.service_type ?? ex.service_type,
    body.phone ?? ex.phone,
    body.email ?? ex.email,
    body.website !== undefined ? body.website : ex.website,
    body.notes !== undefined ? body.notes : ex.notes,
    contractorId,
    house.id
  );

  const updated = db.prepare("SELECT * FROM contractors WHERE id = ?").get(contractorId);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; contractorId: string }> }
) {
  const { slug, contractorId } = await params;
  const db = getDb();

  const house = db.prepare("SELECT id FROM houses WHERE slug = ?").get(slug) as { id: string } | undefined;
  if (!house) return NextResponse.json({ error: "House not found" }, { status: 404 });

  const result = db.prepare("DELETE FROM contractors WHERE id = ? AND house_id = ?").run(contractorId, house.id);
  if (result.changes === 0) return NextResponse.json({ error: "Contractor not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
