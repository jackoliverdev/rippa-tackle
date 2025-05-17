"use client";

import CartHero from "@/components/website/cart/CartHero";
import { CartContent } from "@/components/website/cart/CartContent";

export default function CartPage() {
  return (
    <>
      <CartHero />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <CartContent />
      </div>
    </>
  );
} 