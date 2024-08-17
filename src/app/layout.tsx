import type { Metadata } from "next";
import "../styles/globals.css";
import 'swiper/css';
import 'swiper/css/pagination';
import 'aos/dist/aos.css'
import AosAnimation from "@/components/modules/AosAnimation";
import SocketConnection from "@/components/modules/SocketConnection";

export const metadata: Metadata = {
  title: "Telegram-clone",
  description: "FullStack NextJs Telegram clone with socket.io",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-segoeRegular">
        <AosAnimation />
        <SocketConnection />
        {children}
      </body>
    </html>
  );
}