import { VideoHero } from '@/components/website/videos/VideoHero';
import { VideoGrid } from '@/components/website/videos/VideoGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fishing Videos | Rippa Tackle',
  description: 'Watch the latest carp fishing videos from Jacob London Carper, Henry Lennon and other top anglers.'
};

export default function VideosPage() {
  return (
    <main className="min-h-screen">
      <VideoHero />
      <VideoGrid />
    </main>
  );
} 