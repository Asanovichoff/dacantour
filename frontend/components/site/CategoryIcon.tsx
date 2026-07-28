import { Mountain, Footprints, Landmark, Building2, Sparkles, Snowflake } from "lucide-react";
import type { Category } from "@/lib/data";

const map = {
  horse: Mountain,
  trek: Footprints,
  history: Landmark,
  city: Building2,
  scenic: Sparkles,
  ski: Snowflake,
} as const;

export function CategoryIcon({ icon, className }: { icon: Category["icon"]; className?: string }) {
  const Cmp = map[icon] ?? Sparkles;
  return <Cmp className={className} />;
}
