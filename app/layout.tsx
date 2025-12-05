import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Lora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import AppGuard from "./AppGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// 2. Configurez Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Choisissez les poids dont vous avez besoin
  variable: "--font-poppins", // Optionnel, si vous voulez l'utiliser via CSS
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://braina.ai"),
  title: {
    default: "Braina - Transformez vos documents en Quiz et Flashcards",
    template: "%s | Braina",
  },
  description:
    "Utilisez l'IA pour générer instantanément des quiz, des flashcards et des podcasts éducatifs à partir de vos documents. Apprenez plus intelligemment avec Braina.",
  keywords: [
    "IA",
    "Quiz",
    "Flashcards",
    "Éducation",
    "Apprentissage",
    "Génération automatique",
    "Études",
  ],
  authors: [{ name: "Braina Team" }],
  creator: "Braina Team",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    title: "Braina - Votre assistant d'apprentissage IA",
    description:
      "Transformez n'importe quel contenu en matériel d'étude interactif en quelques secondes.",
    siteName: "Braina",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Braina - AI Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Braina - Apprenez plus vite avec l'IA",
    description:
      "Générez des quiz et flashcards à partir de vos cours en un clic.",
    images: ["/opengraph-image"],
    creator: "@braina_app",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${poppins.className} antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <AppGuard>{children}</AppGuard>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
