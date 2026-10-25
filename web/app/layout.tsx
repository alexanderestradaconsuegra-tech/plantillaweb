import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linea — Live captions for every call and conversation",
  description:
    "Linea turns phone calls and the conversations around you into clear live captions. Free for people with hearing loss, private on your phone.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="m-text">
        <a className="skip-link m-text-6" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
