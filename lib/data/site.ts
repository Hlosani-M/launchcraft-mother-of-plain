import { siteConfig } from "@/data/site";
import type { SiteSettings } from "@/types/site";

/**
 * Site settings repository. Server components call this; client components
 * receive what they need as props or import `siteConfig` for static values.
 * A future Sanity "siteSettings" singleton replaces this body.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  return siteConfig;
}
