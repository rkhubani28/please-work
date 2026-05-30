import "./globals.css";
import { Courier_Prime } from "next/font/google";

const courier = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier",
  display: "swap",
});

export const metadata = {
  title: "SportsHQ — Fantasy Sports AI Platform",
  description: "AI-generated fantasy sports insights across football, hockey, basketball, and baseball.",
  icons: {
    icon: "/logos/sportshq-logo.png",
    apple: "/logos/sportshq-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={courier.variable}>
      <body>{children}</body>
    </html>
  );
}
