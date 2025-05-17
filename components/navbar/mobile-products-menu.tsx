"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBagIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react";

interface MobileProductsMenuProps {
  onItemClick: () => void;
}

export const MobileProductsMenu: React.FC<MobileProductsMenuProps> = ({ onItemClick }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  return (
    <div className="m-1">
      <button
        className="flex items-center justify-between w-full px-4 py-2.5 text-blue-100 hover:bg-blue-800/60 hover:text-white rounded-md transition-all duration-200"
        onClick={() => setIsProductsOpen(!isProductsOpen)}
      >
        <div className="flex items-center">
          <ShoppingBagIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          Products
        </div>
        {isProductsOpen ? 
          <ChevronDownIcon className="h-4 w-4 ml-2" /> : 
          <ChevronRightIcon className="h-4 w-4 ml-2" />
        }
      </button>
      
      {/* Products submenu */}
      {isProductsOpen && (
        <div className="ml-4 pl-2 border-l border-blue-800/40 mt-1">
          <Link
            href="/products"
            className="flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/60 hover:text-white rounded-md transition-all duration-200 my-1"
            onClick={onItemClick}
          >
            All Products
          </Link>
          <Link
            href="/products"
            className="flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/60 hover:text-white rounded-md transition-all duration-200 my-1"
            onClick={onItemClick}
          >
            Tackle
          </Link>
          <Link
            href="/products"
            className="flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/60 hover:text-white rounded-md transition-all duration-200 my-1"
            onClick={onItemClick}
          >
            Bait
          </Link>
          <Link
            href="/products"
            className="flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/60 hover:text-white rounded-md transition-all duration-200 my-1"
            onClick={onItemClick}
          >
            Rigs
          </Link>
          <Link
            href="/products"
            className="flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/60 hover:text-white rounded-md transition-all duration-200 my-1"
            onClick={onItemClick}
          >
            Bundles
          </Link>
        </div>
      )}
    </div>
  );
}; 