import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const db = getDb();
  const house = db.prepare("SELECT address FROM houses WHERE slug = ?").get(slug) as
    | { address: string }
    | undefined;

  const name = house ? house.address : "House Maintenance Platform";

  return NextResponse.json({
    name,
    short_name: house ? house.address : "Home Maint.",
    description: "Keep your home in top shape with organized maintenance tracking.",
    start_url: `/house/${slug}`,
    display: "standalone",
    background_color: "#fdfaf5",
    theme_color: "#8d5f36",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  });
}
