import React from 'react';
import { Navbar } from './components/navigation/Navbar';
import { HeroSection } from './features/hero/HeroSection';
import { StorytellingSection } from './features/storytelling/StorytellingSection';
import { MissionSection } from './features/event-info/MissionSection';
import { HighlightsSection } from './features/event-info/HighlightsSection';
import { AnnouncementsSection } from './features/announcements/AnnouncementsSection';
import { RegistrationSection } from './features/registration/RegistrationSection';
import { SubscriptionSection } from './features/subscription/SubscriptionSection';
import { FaqSection } from './features/faq/FaqSection';
import { Footer } from './components/layout/Footer';

export const App: React.FC = () => {
  return (
    <div className="app-root">
      {/* Navigation */}
      <Navbar />

      {/* Main Experience Stream */}
      <main id="main-content">
        <HeroSection />
        <StorytellingSection />
        <MissionSection />
        <HighlightsSection />
        <AnnouncementsSection />
        <RegistrationSection />
        <SubscriptionSection />
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
