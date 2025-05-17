"use client";

import WishlistHero from "@/components/website/wishlist/WishlistHero";
import { WishlistContent } from "@/components/website/wishlist/WishlistContent";

export default function WishlistPage() {
  return (
    <>
      <WishlistHero />

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <WishlistContent />
      </div>
    </>
  );
} 