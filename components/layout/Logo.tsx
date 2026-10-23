import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site";

/**
 * The supplied logo: the red square on light surfaces, the white mark on dark
 * ones. Falls back to a plain typographic wordmark if no logo is configured.
 */
export function Logo({ inverse = false, className = "" }: { inverse?: boolean; className?: string }) {
  const { logo } = siteConfig.brand;
  const image = logo && (inverse ? logo.inverse : logo);

  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center ${className}`}
      aria-label={`${siteConfig.name} home`}
    >
      {image ? (
        <Image
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          className={inverse ? "h-20 w-auto" : "size-12 rounded-sm lg:size-16"}
          sizes={inverse ? "96px" : "64px"}
          priority={!inverse}
        />
      ) : (
        <span className="flex flex-col font-display leading-none uppercase">
          <span
            className={`text-[1.35rem] font-extrabold tracking-tight sm:text-2xl ${inverse ? "text-white" : "text-ink"}`}
          >
            Mother <span className={inverse ? "text-white" : "text-brand"}>of</span> Plain
          </span>
          <span
            className={`mt-0.5 text-[0.7rem] font-bold tracking-[0.32em] ${inverse ? "text-white/85" : "text-brand"}`}
          >
            Foods
          </span>
        </span>
      )}
    </Link>
  );
}
