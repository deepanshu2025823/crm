// app/page.tsx
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SocialProof from '@/components/SocialProof';
import FeaturesGrid from '@/components/FeaturesGrid';
import ChatWidget from '@/components/ChatWidget';

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <FeaturesGrid />
      <ChatWidget />
    </main>
  );
}