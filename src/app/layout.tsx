import type { Metadata } from "next";
import "./globals.scss";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Email Buddy",
  description: "An app combining OpenAI with Nylas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="has-navbar-fixed-top">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
