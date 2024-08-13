import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Telegram-clone",
  description: "FullStack NextJs Telegram clone with socket.io",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-segoeRegular">
        {children}
      </body>
    </html>
  );
}