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
    manifest: '/manifest.json'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" type="image/png" href="./images/favicon-96x96.png" sizes="96x96" />
                <link rel="icon" type="image/svg+xml" href="./images/favicon.svg" />
                <link rel="shortcut icon" href="./images/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="./images/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-title" content="Telegram" />
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