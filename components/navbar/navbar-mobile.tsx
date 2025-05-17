"use client";

import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { useState } from "react";
import Link from "next/link";
import { MenuIcon, HomeIcon, VideoIcon, InfoIcon, X } from "lucide-react";
import { MobileProductsMenu } from "./mobile-products-menu";

export const NavbarMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center relative">
      {/* Hamburger menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)} 
        className="p-1.5 bg-blue-800/40 text-white hover:bg-blue-800/60 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {/* Dropdown menu - uses fixed positioning to ensure visibility */}
      {isOpen && (
        <>
          {/* Overlay to capture clicks outside the menu */}
          <div 
            className="fixed inset-0 bg-black/20 z-50" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* The actual menu */}
          <div className="fixed top-[64px] right-4 z-[60] flex flex-col p-1 bg-blue-900 border border-blue-800/40 shadow-xl rounded-lg min-w-[220px]">
            <Link
              href="/"
              className="flex items-center px-4 py-2.5 text-blue-100 hover:bg-blue-800/60 hover:text-white rounded-md m-1 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <HomeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              Home
            </Link>
            
            {/* Products submenu - imported from client component */}
            <MobileProductsMenu onItemClick={() => setIsOpen(false)} />
            
            <Link
              href="/videos"
              className="flex items-center px-4 py-2.5 text-blue-100 hover:bg-blue-800/60 hover:text-white rounded-md m-1 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <VideoIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              Videos
            </Link>
            <Link
              href="/about"
              className="flex items-center px-4 py-2.5 text-blue-100 hover:bg-blue-800/60 hover:text-white rounded-md m-1 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <InfoIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              About
            </Link>
            <div className="px-1 pt-2 pb-1 border-t border-blue-800/40 mt-1">
              <NavbarUserLinks />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
