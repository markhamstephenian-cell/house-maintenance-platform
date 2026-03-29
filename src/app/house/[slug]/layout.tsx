import { Metadata } from "next";
import { getDb } from "@/lib/db";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const house = db.prepare("SELECT address FROM houses WHERE slug = ?").get(slug) as
    | { address: string }
    | undefined;

  const title = house ? `${house.address} — Home Maintenance` : "House Maintenance Platform";

  return {
    title,
    manifest: `/house/${slug}/manifest.json`,
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: house?.address ?? "Home Maint.",
    },
  };
}

export default function HouseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
