import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ponzio Editor",
  description: "Create and customize a json file to pdf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
