"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-lg">G</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Geddit</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/auth/login"
              className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-7 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              Get Started
              <MoveRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
