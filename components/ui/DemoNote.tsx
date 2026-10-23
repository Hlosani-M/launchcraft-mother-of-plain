import { Info } from "lucide-react";
import { siteConfig } from "@/data/site";

/** Discreet catalogue disclaimer shown only while `demoCatalogue` is on. */
export function DemoNote({ className = "" }: { className?: string }) {
  if (!siteConfig.demoCatalogue) return null;
  return (
    <p className={`flex items-start gap-2 text-xs text-muted ${className}`}>
      <Info className="mt-px size-3.5 shrink-0" aria-hidden="true" />
      {siteConfig.demoCatalogueNote}
    </p>
  );
}
