import type { Metadata } from "next";
import "../styles/globals.css";
import 'swiper/css';
import 'swiper/css/pagination';
import 'aos/dist/aos.css'
import AosAnimation from "@/components/modules/AosAnimation";
import { Toaster } from "react-hot-toast";
import { NextUIProvider } from "@nextui-org/system";
import AudioManager from "@/components/templates/AudioManager";

export const metadata: Metadata = {
    title: "Telegram-clone",
    description: "FullStack NextJs Telegram clone with socket.io",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="./images/telegram.svg" />
                <link rel="manifest" href="./manifest.json" />
            </head>
            <body className="font-segoeRegular overflow-hidden">
                <NextUIProvider>
                    <AosAnimation />
                    {children}
                    <Toaster containerStyle={{ zIndex: '999999999999999' }} />
                    <AudioManager />
                </NextUIProvider>
            </body>
        </html>
    );
}