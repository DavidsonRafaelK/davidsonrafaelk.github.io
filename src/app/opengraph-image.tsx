import { ImageResponse } from "next/og";
import { siteDescription, siteName } from "@/lib/site";

export const alt = `${siteName} — Web Developer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#000000",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>
        {siteName}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 24,
          fontSize: 32,
          color: "#a1a1aa",
          maxWidth: 900,
        }}
      >
        {siteDescription}
      </div>
    </div>,
    { ...size },
  );
}
