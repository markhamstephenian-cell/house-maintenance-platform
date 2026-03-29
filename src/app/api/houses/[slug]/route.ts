import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const db = getDb();

  const house = db.prepare("SELECT * FROM houses WHERE slug = ?").get(slug);
  if (!house) {
    return NextResponse.json({ error: "House not found" }, { status: 404 });
  }

  const tasks = db
    .prepare("SELECT * FROM tasks WHERE house_id = ? ORDER BY created_at")
    .all((house as { id: string }).id);

  const contractors = db
    .prepare("SELECT * FROM contractors WHERE house_id = ? ORDER BY name")
    .all((house as { id: string }).id);

  return NextResponse.json({ house, tasks, contractors }, {
    headers: { "Cache-Control": "no-store" },
  });
}
