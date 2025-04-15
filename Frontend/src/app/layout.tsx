import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeadComponent from "./HeadComponent";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import { WebSocketProvider } from "@/context/indexSocket";

// const projectId = "7fa218462e5a87740e563e1a639377bd";

// ✅ Font Configurations
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HeadComponent />
        <WebSocketProvider>
          <ContextProvider cookies={cookies}>{children}</ContextProvider>
        </WebSocketProvider>
      </body>
    </html>
  );
}
