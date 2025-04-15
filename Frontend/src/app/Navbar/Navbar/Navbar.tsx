"use client";

import { FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppKitAccount } from "@reown/appkit/react";
import { v5 as uuidv5 } from "uuid";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { address, isConnected } = useAppKitAccount();

  const NAMESPACE = "b3e6d1f4-7e79-40c2-a2b6-2f409f2cb1fd";

  useEffect(() => {
    if (isConnected && address) {
      const uuid = uuidv5(address, NAMESPACE);
      const shortId = uuid.split("-")[0];
      localStorage.setItem("userId", "user" + shortId);
      console.log("UUID userId saved:", "user" + shortId);
    } else {
      localStorage.removeItem("chatId");
      localStorage.removeItem("userId");
      console.log("Wallet Disconnected, chatId removed");
    }
  }, [isConnected, address]);

  return (
    <nav className="bg-[#121212] py-4 px-6 flex justify-between items-center relative">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden text-white text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Logo & Links */}
      <div className="flex items-center space-x-8">
        <img src="/logo.png" alt="AI Logo" className="w-8 h-8" />
        <div
          className={`absolute top-full left-0 w-full bg-[#121212] lg:static lg:flex lg:space-x-8 lg:bg-transparent ${
            menuOpen ? "block" : "hidden"
          } lg:block`}
        >
          <Link
            href="/Playground"
            className="block py-2 px-6 text-lg font-semibold text-white hover:text-purple-400"
          >
            PlayGround
          </Link>
          <Link
            href="/"
            className="block py-2 px-6 text-lg font-semibold text-white hover:text-purple-400"
          >
            Docs
          </Link>
          <Link
            href="/"
            className="block py-2 px-6 text-lg font-semibold text-white hover:text-purple-400"
          >
            Community
          </Link>
        </div>
      </div>

      {/* Web3Button to connect wallet */}
      <div className="flex items-center space-x-4">
        <appkit-button />
      </div>
    </nav>
  );
};

export default Navbar;
