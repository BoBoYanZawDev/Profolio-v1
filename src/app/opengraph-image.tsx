import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Bo Bo Yan Zaw — Full-Stack Web Developer";
export const size = { width: 1200, height: 630 };

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #06060b 0%, #0d0d1a 55%, #131028 100%)",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #3b82f6, #67e8f9)",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#3b82f6",
            letterSpacing: 4,
            marginBottom: 24,
          }}
        >
          {"// FULL—STACK WEB DEVELOPER"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            color: "#f2efe9",
            lineHeight: 1.05,
          }}
        >
          BO BO YAN ZAW
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#8b8b9e",
            marginTop: 24,
          }}
        >
          PHP · Laravel · React · JavaScript · MySQL
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#67e8f9",
            marginTop: 40,
          }}
        >
          boboyanzaw.dev@gmail.com — github.com/BoBoYanZawDev
        </div>
      </div>
    ),
    { ...size }
  );
}
