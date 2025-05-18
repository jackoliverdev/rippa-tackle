import { ReactNode } from "react";
import { NavBar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer";
import { WishlistProvider } from "@/context/wishlist-context";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "sonner";
import { RecentPurchaseToast } from "@/components/website/RecentPurchaseToast";
import { FloatingFishingAssistant } from "@/components/website/FloatingFishingAssistant";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-right" richColors />
          <RecentPurchaseToast />
          <FloatingFishingAssistant />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}
