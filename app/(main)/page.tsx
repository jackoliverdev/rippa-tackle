import { Hero } from "@/components/website/hero";
import { BestSellers } from "@/components/website/BestSellers";
import { Brands } from "@/components/website/home/Brands";
import { FeaturedBlogs } from "@/components/website/FeaturedBlogs";
import { FeaturedVideos } from "@/components/website/FeaturedVideos";
import { OurArmoury } from "@/components/website/home/OurArmoury";

export default function Home() {
  return (
    <main>
      <Hero />
      <BestSellers />
      <Brands />
      <OurArmoury />
      <FeaturedVideos />
      <FeaturedBlogs />
    </main>
  );
}
