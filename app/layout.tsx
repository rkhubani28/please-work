import "./globals.css";

export const metadata = {
  title: "SportsHQ",
  description: "Fantasy sports AI platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}