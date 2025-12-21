import "../styles/globals.css";
import Providers from "../components/Providers";
import { Suspense } from "react";

export const metadata = {
    title: "نما",
    icons: {
        icon: "/assets/logo-arman.png",
    },
};

export default function RootLayout({ children }) {
    return (
        <html dir="rtl" lang="fa">
            <body style={{ position: "relative" }}>
                <Suspense fallback={null}>
                    <Providers>{children}</Providers>
                </Suspense>
            </body>
        </html>
    );
}
