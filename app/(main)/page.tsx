import { Hero } from "@/components/website/hero";
import { BestSellers } from "@/components/website/BestSellers";
import { Brands } from "@/components/website/home/Brands";
import { FeaturedBlogs } from "@/components/website/FeaturedBlogs";
import { FeaturedVideos } from "@/components/website/FeaturedVideos";

export default function Home() {
  return (
    <main>
      <Hero />
      <BestSellers />
      <Brands />
      <FeaturedVideos />
      <FeaturedBlogs />
    </main>
  );
}
