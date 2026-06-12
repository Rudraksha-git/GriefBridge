"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Bell, BookHeart } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Legacy Vault", href: "/legacy", icon: BookHeart },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-[family-name:var(--font-lora)] text-xl font-medium text-stone-800 transition-opacity hover:opacity-80">
              Grief<span className="text-brand-600">Bridge</span>
            </Link>

            <nav className="hidden md:flex space-x-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`nav-link group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out ${
                      isActive
                        ? "active bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100/50"
                        : "text-stone-500 hover:bg-white/80 hover:text-stone-800 hover:shadow-sm hover:ring-1 hover:ring-stone-200/50"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-brand-600' : 'text-stone-400 group-hover:text-brand-500'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <AuthBadge />
          </div>
        </div>
      </div>
    </header>
  );
}

function AuthBadge() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return (
      <div className="flex gap-2">
        <Link href="/sign-in" className="text-xs font-semibold px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors">
          Sign In
        </Link>
        <Link href="/sign-up" className="text-xs font-semibold px-4 py-2 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-colors">
          Sign Up
        </Link>
      </div>
    );
  }

  const name = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.firstName || user.username || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "Family Account";

  return (
    <div className="flex items-center gap-3 px-2 py-1 rounded-full bg-white/60 border border-stone-200/60 shadow-sm hover:bg-white transition-all duration-300 group">
      <div className="flex flex-col items-end hidden sm:flex pl-2">
        <span className="text-xs font-medium text-stone-800 leading-tight">{name}</span>
        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Family access</span>
      </div>
      <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
