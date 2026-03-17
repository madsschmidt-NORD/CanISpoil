import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CanISpoil",
  description: "A spoiler etiquette calculator with a premium Max-inspired feel."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  );
}
