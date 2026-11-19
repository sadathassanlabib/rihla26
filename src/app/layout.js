
import "./globals.css";
import { Suspense } from "react";

import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import FloatingCall from "@/components/FloatingCall";
import NatureSoundscape from "@/components/NatureSoundscape";
import Footer from "@/components/Footer";
import FloatingRegisterButton from "@/components/FloatingRegisterButton";

export const metadata = {
  title: "Rihla'26 – SOROB",
  description: "Tour management",
};

export default function RootLayout({ children }) {
  const phone = process.env.NEXT_PUBLIC_CONTACT_NUMBER || "";

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-200">
        <Providers>
          <Navbar />

          {children}

          <NatureSoundscape />
          <FloatingCall phone={phone} />

          <Suspense fallback={null}>
            <FloatingRegisterButton />
          </Suspense>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
