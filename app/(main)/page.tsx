import { Hero } from "@/components/website/hero";
import { BestSellers } from "@/components/website/BestSellers";
import { FishingAssistantChat } from "@/components/website/FishingAssistantChat";
import { Brands } from "@/components/website/home/Brands";
import { FeaturedBlogs } from "@/components/website/FeaturedBlogs";

export default function Home() {
  return (
    <main>
      <Hero />
      <BestSellers />
      <Brands />
      <FishingAssistantChat />
      <FeaturedBlogs />
    </main>
  );
}
