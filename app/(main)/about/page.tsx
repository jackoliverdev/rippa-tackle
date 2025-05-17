import { Metadata } from 'next';
import AboutHero from '@/components/website/AboutHero';
import AboutMission from '@/components/website/AboutMission';
import AboutStory from '@/components/website/AboutStory';
import AboutTeam from '@/components/website/AboutTeam';

export const metadata: Metadata = {
  title: 'About Us | Rippa Tackle - Carp Specialists',
  description: 'Learn about the Rippa Tackle story, our founder Jacob Worth, and our mission to provide quality fishing tackle for serious anglers.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutHero />
      <AboutMission />
      <AboutStory />
      <AboutTeam />
    </main>
  );
} 