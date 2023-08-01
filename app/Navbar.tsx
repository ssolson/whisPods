"use client";

import Link from "next/link";
import { RiGasStationFill } from "react-icons/ri";

export default function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-stone-950">
      {/* Fixed Navbar */}
      <header className="flex h-20 items-center justify-between bg-stone-950 px-6 text-xl font-semibold text-gray-100">
        {/* Logo */}
        <Link href={"/"}>
          <div className="flex items-center text-4xl font-bold">
            <p className="text-5xl text-violet-400">
              <RiGasStationFill />
            </p>
            <p className="ml-2 text-5xl">TLDL:</p>
          </div>
        </Link>

        {/* Central Content */}
        <div className="mx-12 hidden text-gray-100 lg:flex">
          {/* Empty for now, fill this as needed */}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden bg-zinc-900">{children}</div>
    </div>
  );
}
