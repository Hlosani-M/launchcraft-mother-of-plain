import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const alt = `${siteConfig.name}: ${siteConfig.descriptor} in Mitchell's Plain`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = siteConfig.brand.logo;
  const logoData = logo
    ? `data:image/png;base64,${(await readFile(join(process.cwd(), "public", logo.inverse.src))).toString("base64")}`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#D72729",
          color: "#fff",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: 6, textTransform: "uppercase" }}>
            {siteConfig.name} • Mitchell&apos;s Plain
          </div>
          {logoData && <img src={logoData} width={210} height={179} alt="" />}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 132, fontWeight: 800, lineHeight: 0.9, letterSpacing: -4, textTransform: "uppercase" }}>
          <span>Fresh cuts.</span>
          <span>Big value.</span>
        </div>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 600 }}>{siteConfig.descriptor}</div>
      </div>
    ),
    size,
  );
}
