import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Music Player - Ad-Free YouTube Music",
  description: "A sleek, ad-free music player that sources audio from YouTube",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
