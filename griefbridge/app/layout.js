import { ClerkProvider } from "@clerk/nextjs";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import AppShell from "../components/AppShell";

const lora = Lora({ subsets: ['latin'], variable: '--font-lora', style: ['normal', 'italic'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: "GriefBridge",
  description: "Autonomous multi-agent AI system that helps families after a death",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${lora.variable} ${inter.variable} antialiased h-full`}
      >
        <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)] text-sm text-stone-600 leading-relaxed">
          <AppShell>{children}</AppShell>
        </body>
      </html>
    </ClerkProvider>
  );
}
