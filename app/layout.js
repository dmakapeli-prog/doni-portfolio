import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Donie Makapeli | Web Developer & Data Analyst",
  description:
    "Portfolio Donie Makapeli — Mahasiswa S1 Teknik Informatika Universitas Nusa Putra. Web Developer dan Data Analyst.",
  keywords: [
    "Donie Makapeli",
    "Portfolio",
    "Web Developer",
    "Data Analyst",
    "Next.js",
    "Tailwind CSS",
    "Python",
    "Universitas Nusa Putra",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable} antialiased`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
