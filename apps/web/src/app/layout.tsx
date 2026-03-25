import type { Metadata, Viewport } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const fontHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const fontBody = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "NurseAda — Your 24/7 Healthcare Companion",
    template: "%s | NurseAda",
  },
  description:
    "AI-powered virtual healthcare assistant providing symptom analysis, medication management, herbal remedies, and appointment coordination for Nigeria and Africa.",
  keywords: [
    "healthcare",
    "AI",
    "chatbot",
    "Nigeria",
    "Africa",
    "primary care",
    "telemedicine",
    "herbal remedies",
  ],
  manifest: "/manifest.json",
  openGraph: {
    title: "NurseAda — Your 24/7 Healthcare Companion",
    description:
      "AI-powered virtual healthcare assistant for Nigeria and Africa",
    type: "website",
    locale: "en_NG",
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontHeading.variable} ${fontBody.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--color-surface-elevated)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
            },
          }}
        />
      </body>
    </html>
  );
}
