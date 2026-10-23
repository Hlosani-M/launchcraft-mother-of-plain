import {
  Beef,
  Drumstick,
  Fish,
  Flame,
  Ham,
  Package,
  ShoppingBasket,
  Snowflake,
  SprayCan,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import type { CategorySlug } from "@/types/catalogue";

const icons: Record<CategorySlug, LucideIcon> = {
  beef: Beef,
  "lamb-mutton": Ham,
  chicken: Drumstick,
  "wors-sausages-burgers": Flame,
  deli: ShoppingBasket,
  seafood: Fish,
  hampers: Package,
  groceries: Wheat,
  frozen: Snowflake,
  household: SprayCan,
};

export function CategoryIcon({
  category,
  className = "size-6",
  strokeWidth = 1.75,
}: {
  category: CategorySlug;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = icons[category];
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
