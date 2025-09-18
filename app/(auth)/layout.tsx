import type { Metadata } from "next";
import "../../src/app/globals.css";

export const metadata: Metadata = {
  title: "Security Posture Dashboard - Authentication",
  description: "Sign in to access your security posture dashboard",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}