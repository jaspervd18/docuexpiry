import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "DocuExpiry - Never miss a document expiration";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #fefce8 0%, #ffffff 40%, #fffbeb 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #eab308, #ca8a04)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #eab308, #ca8a04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            D
          </div>
          <div style={{ fontSize: "28px", fontWeight: 600, color: "#18181b" }}>
            DocuExpiry
          </div>
        </div>

        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#18181b",
            lineHeight: 1.15,
            maxWidth: "800px",
            letterSpacing: "-0.02em",
          }}
        >
          Never miss a document expiration.
        </div>

        <div
          style={{
            fontSize: "24px",
            color: "#71717a",
            marginTop: "20px",
            maxWidth: "700px",
            lineHeight: 1.5,
          }}
        >
          Track passports, insurance, licences, and contracts. Get reminded
          before they expire.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginTop: "48px",
          }}
        >
          <div
            style={{
              padding: "10px 24px",
              borderRadius: "9999px",
              background: "#18181b",
              color: "#fefce8",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Start free
          </div>
          <div style={{ fontSize: "18px", color: "#a1a1aa" }}>
            docuexpiry.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
