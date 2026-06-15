import { Poppins } from "next/font/google";
import "./globals.css";

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
    <html lang="id" className={`${poppins.variable} antialiased`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
