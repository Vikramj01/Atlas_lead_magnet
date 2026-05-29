import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Signal Gap Calculator | Atlas by ViMi Digital",
  description:
    "Answer 7 questions about your tracking setup. Get your Signal Health Score and see what your signal gaps are costing you each month.",
  themeColor: "#0A0A0F",
  openGraph: {
    title: "Signal Gap Calculator | Atlas by ViMi Digital",
    description:
      "Answer 7 questions about your tracking setup. Get your Signal Health Score and see what your signal gaps are costing you each month.",
    images: ["/og-signal-calculator.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const atlasUrl = process.env.NEXT_PUBLIC_ATLAS_URL ?? "https://vimi.digital/atlas";

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <header className="w-full px-6 py-4">
          <a href={atlasUrl} target="_blank" rel="noopener noreferrer">
            <Image
              src="https://v0-atlas-product-website.vercel.app/Atlas%20logo%201.jpeg"
              alt="Atlas by ViMi Digital"
              width={80}
              height={32}
              className="h-8 w-auto object-contain"
              unoptimized
            />
          </a>
        </header>
        <main className="mx-auto w-full max-w-[640px] px-6 md:px-12">
          {children}
        </main>
      </body>
    </html>
  );
}
