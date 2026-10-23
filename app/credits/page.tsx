import type { Metadata } from "next";
import Image from "next/image";
import { imageCredits } from "@/data/imageCredits";
import { siteConfig } from "@/data/site";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Image Credits",
  description: "Credits and licences for product photography used on the Mother of Plain Foods website.",
  alternates: { canonical: "/credits" },
};

export default function CreditsPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: "/", label: "Home" }, { label: "Image credits" }]} title="Image credits" />
      <div className="container-page py-8 sm:py-10">
        <p className="max-w-2xl text-muted">
          Product images are for illustration only. Some were supplied by {siteConfig.name} or are sample photos for this demonstration; the photos
          below are openly licensed and used with thanks to their photographers. Some have been cropped and resized.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {imageCredits.map((credit) => (
            <li key={credit.file} className="flex gap-3 rounded-(--radius-card) border border-line p-3">
              <span className="relative size-16 shrink-0 overflow-hidden rounded-md">
                <Image src={credit.file} alt="" fill sizes="64px" className="object-cover" />
              </span>
              <p className="min-w-0 text-sm">
                <a
                  href={credit.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate font-semibold hover:text-brand hover:underline"
                >
                  {credit.title}
                </a>
                <span className="block truncate text-muted">by {credit.author}</span>
                {credit.licenseUrl ? (
                  <a
                    href={credit.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted underline underline-offset-2 hover:text-brand"
                  >
                    {credit.license}
                  </a>
                ) : (
                  <span className="text-muted">{credit.license}</span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
