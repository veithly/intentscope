import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: "IntentScope",
  description: "A live LI.FI Intents flight recorder for builders.",
  openGraph: {
    title: "IntentScope",
    description: "Turn one LI.FI Intents quote into an annotated trace.",
    images: ["/brand/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
