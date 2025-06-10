import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tela de Login",
  description: "Velocity4",
  generator: "Velocity4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
