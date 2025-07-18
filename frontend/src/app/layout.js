import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata = {
  title: "KCC Classes | Best Tutoring in Karjat",
  description:
    "KCC Classes offers top-quality tutoring in Karjat for high school and college students. Join us for the best results in academics and competitive exams.",
  keywords: [
    "KCC Classes",
    "Classes in Karjat",
    "Tutoring in Karjat",
    "Best Classes Karjat",
    "Karjat Classes",
    "Karjat Tutoring",
    "Karjat Education",
    "Karjat Coaching",
    "Karjat",
    "Tutoring",
    "Coaching",
    "High School",
    "College",
    "Competitive Exams",
    "Best Classes Karjat",
    "5th standard classes",
    "6th standard classes",
    "7th standard classes",
    "8th standard classes",
    "9th standard classes",
    "10th standard classes",
    "11th standard classes",
    "12th standard classes",
    "Commerce Classes",
    "Science Classes",
  ],
  authors: [{ name: "KCC Classes", url: "https://kccclasses.in" }],
  creator: "KCC Classes",
  openGraph: {
    title: "KCC Classes | Best Tutoring in Karjat",
    description:
      "KCC Classes offers top-quality tutoring in Karjat for high school and college students. Join us for the best results in academics and competitive exams.",
    url: "https://kccclasses.in",
    siteName: "KCC Classes",
    images: [
      {
        url: "/favicon.ico",
        width: 800,
        height: 600,
        alt: "KCC Classes Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KCC Classes | Best Tutoring in Karjat",
    description:
      "KCC Classes offers top-quality tutoring in Karjat for high school and college students.",
    site: "@kccclasses",
    images: ["/public/images/KCC-CLASSES.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="KCC Classes | Best Tutoring classes in Karjat"
        />
        <meta
          property="og:description"
          content="KCC Classes offers top-quality tutoring in Karjat for high school and college students. Join us for the best results in academics and competitive exams."
        />
        <meta property="og:image" content="/images/KCC-CLASSES.png" />
        <meta property="og:url" content="https://kccclasses.in" />
        <meta property="og:site_name" content="KCC Classes" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="KCC Classes | Best Tutoring classes in Karjat"
        />
        <meta
          name="twitter:description"
          content="KCC Classes offers top-quality tutoring in Karjat for high school and college students from 5th-10th & 11th-12th(Science-Commerce)."
        />
        <meta name="twitter:image" content="/images/KCC-CLASSES.png" />
        <meta name="twitter:site" content="@kccclasses" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.className} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
