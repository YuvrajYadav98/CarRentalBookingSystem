import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import { AuthProvider } from "@/context/AuthContext";
import { site } from "@/lib/siteConfig";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-poppins", display: "swap" });

export const metadata = {
  metadataBase: new URL(site.url),

  verification: {
    google: "uDrwPWMhmVnXwemn9maQ9Z8Ly7BWTnsBA_8FIElzxhc",
  },

  title: {
    default: `Cab Service in Indore | Taxi, Airport & Outstation | ${site.name}`,
    template: `%s | ${site.name}`,
  },

  description: "Book reliable cabs in Indore: airport taxi, local rentals and outstation trips to Ujjain, Omkareshwar, Maheshwar and more. Clean cars, experienced drivers.",

  openGraph: { type: "website", locale: "en_IN", siteName: site.name },
  twitter: { card: "summary" },
  alternates: { canonical: "/" },
};

export const viewport = { themeColor: "#0B1B3A" };

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
        </AuthProvider>
      </body>
    </html>
  );
}
