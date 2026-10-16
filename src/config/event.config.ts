import type { EventConfig } from '../types/event';

/**
 * CENTRALIZED EVENT CONFIGURATION
 * Single source of truth for all configurable branding, timing, venue,
 * registration endpoints, sample announcements, and FAQ copy.
 *
 * NOTE: All event details marked with 'tentative' or 'isUrlPlaceholder' reflect
 * the pre-launch planning state as of Phase 1. Final organizer decisions will
 * seamlessly update here or be loaded via future NestJS API endpoints.
 */
export const EVENT_CONFIG: EventConfig = {
  branding: {
    name: 'National Unity Walkathon 2027',
    shortName: 'Walkathon 2027',
    organizerName: 'RSS Prida Bharati',
    isOrganizerTentative: true,
    edition: 'Inaugural 2027 Movement',
    headline: 'EVERY STEP. ONE PURPOSE.',
    subheadline: 'The Grand Civic Movement for Health, Harmony & Collective Spirit',
    supportingLine: 'A movement begins with you.',
    badgeText: 'Planned for January 2027 • Official Launch Pending',
  },

  timing: {
    displayDate: 'January 2027',
    monthYear: 'January 2027',
    tentativeDate: 'Mid-January 2027 (Weekend Edition)',
    timeZone: 'IST (UTC+05:30)',
    isDateFinalized: false,
  },

  location: {
    city: 'State Capital Metropolitan Region',
    state: 'State Arena & Civic Boulevard',
    venueName: 'Central Civic Grand Park & Sports Corridor (Tentative)',
    isVenueFinalized: false,
    statusNote: 'Exact start line and route permits currently under municipal consultation.',
  },

  scale: {
    targetRegistrations: 20000,
    expectedParticipants: 10000,
    peakArrivalRate: '~1,000 walkers / 5 minutes',
    distanceCategories: [
      {
        id: 'dist-3k',
        name: '3K Harmony Stride',
        distanceKm: 3,
        description: 'An open, inclusive walk designed for families, seniors, and beginners celebrating collective togetherness.',
        eligibility: 'All ages welcome (Children under 12 accompanied by an adult)',
        isTentative: true,
      },
      {
        id: 'dist-5k',
        name: '5K Fitness Challenge',
        distanceKm: 5,
        description: 'A dynamic, brisk fitness walk along the urban boulevard fostering cardiovascular wellness and community vigor.',
        eligibility: 'Open to participants aged 10 and above',
        isTentative: true,
      },
      {
        id: 'dist-10k',
        name: '10K Endurance Stride',
        distanceKm: 10,
        description: 'Our flagship endurance distance for dedicated walkers, fitness clubs, and civic advocates seeking personal triumph.',
        eligibility: 'Open to participants aged 14 and above with moderate stamina',
        isTentative: true,
      },
    ],
  },

  registration: {
    mode: 'google-forms-link',
    // Realistic placeholder Google Forms URL for Phase 1
    googleFormsUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-DEMO-WALKATHON-2027-PLACEHOLDER/viewform',
    isUrlPlaceholder: true,
    instructions:
      'Phase 1 registration is conducted exclusively via Google Forms. Participation is completely free and unmonetized.',
    participationFeeNotice: 'No registration fees or commercial transactions are required in this phase.',
    allowEmbedPreview: true,
  },

  highlights: [
    {
      id: 'hl-capacity',
      title: 'Target Registration',
      value: '20,000 Slots',
      subtitle: 'Expected 10,000 active participants',
      icon: 'Users',
      status: 'confirmed',
      statusLabel: 'Infrastructure Baseline',
    },
    {
      id: 'hl-date',
      title: 'Event Timeline',
      value: 'January 2027',
      subtitle: 'Exact weekend date to be confirmed',
      icon: 'Calendar',
      status: 'tentative',
      statusLabel: 'Date TBA',
    },
    {
      id: 'hl-venue',
      title: 'Civic Corridor',
      value: 'Metropolitan Route',
      subtitle: 'City boulevard & scenic park loop',
      icon: 'MapPin',
      status: 'tentative',
      statusLabel: 'Route in Review',
    },
    {
      id: 'hl-wellness',
      title: 'Participant Amenities',
      value: 'Full Hydration & Aid',
      subtitle: 'Emergency medical stations every 1.5 km',
      icon: 'ShieldCheck',
      status: 'confirmed',
      statusLabel: 'Safety Standard',
    },
    {
      id: 'hl-medal',
      title: 'Recognition',
      value: 'Finisher Keepsake',
      subtitle: 'Commemorative medal & digital e-certificate',
      icon: 'Award',
      status: 'tentative',
      statusLabel: 'Design in Progress',
    },
    {
      id: 'hl-peak',
      title: 'Corridor Flow',
      value: 'Staggered Wave Start',
      subtitle: 'Engineered for ~1,000 arrivals / 5 min peak',
      icon: 'Activity',
      status: 'confirmed',
      statusLabel: 'Crowd Safety Plan',
    },
  ],

  storyline: [
    {
      number: '01',
      phase: 'The Spark',
      headline: 'One Single Step Sets the Rhythm',
      lead: 'Every great transformation begins not with a crowd, but with a solitary decision to move forward.',
      description:
        'When an individual chooses movement over inertia, it radiates outward. The walkathon celebrates everyday citizens taking that foundational first stride toward personal vitality and communal vitality.',
      metricLabel: 'Individual Energy',
      metricValue: '1 Step',
    },
    {
      number: '02',
      phase: 'The Momentum',
      headline: 'A Thousand Strides Unite the Boulevard',
      lead: 'As individual footprints converge, solitary effort transforms into a resonant civic heartbeat.',
      description:
        'Imagine 10,000 walkers of all generations moving side by side under the cool January sunrise. Diverse backgrounds, shared rhythm, unified resolve—transforming city streets into an arena of shared optimism.',
      metricLabel: 'Collective Presence',
      metricValue: '10,000+',
    },
    {
      number: '03',
      phase: 'The Legacy',
      headline: 'An Enduring Ripple of Health & Harmony',
      lead: 'Crossing the finish line is not the conclusion—it is the catalyst for sustainable civic well-being.',
      description:
        'The walkathon leaves behind stronger social bonds, inspired youth, revitalized seniors, and an ongoing commitment to daily movement. The pavement cools, but the community warmth persists.',
      metricLabel: 'Civic Impact',
      metricValue: 'Infinite',
    },
  ],

  announcements: [
    {
      id: 'ann-01',
      title: 'Phase 1 Digital Experience & Pre-Registration Blueprint Unveiled',
      category: 'Official',
      date: 'October 2026',
      summary:
        'The technical preview of the Walkathon 2027 platform is now live to gather initial feedback and prepare for civic coordination.',
      body:
        'We are proud to present the Phase 1 digital foundation for the January 2027 Walkathon. This platform establishes the visual identity, crowd scaling parameters (designed for 20,000 registrations), and Google Forms integration. Formal dates and venue announcements will be coordinated closely with municipal authorities.',
      isSample: true,
    },
    {
      id: 'ann-02',
      title: 'Volunteer Coordination & Medical Support Protocol In Planning',
      category: 'Health & Safety',
      date: 'September 2026',
      summary:
        'Comprehensive medical staging plans and volunteer stations are being mapped out across the proposed 3K, 5K, and 10K courses.',
      body:
        'Participant well-being is the primary tenet of the event. Ambulance corridors, rapid-response medical bikes, and hydration stops spaced at 1.5 km intervals are under active design to support the anticipated 1,000 visitors-per-five-minute peak ingress.',
      isSample: true,
    },
    {
      id: 'ann-03',
      title: 'Community Walking Clubs Invited for Route Feedback Sessions',
      category: 'Community',
      date: 'August 2026',
      summary:
        'Local fitness collectives, senior walking clubs, and youth sports groups will be invited to trial the tentative route segments.',
      body:
        'To ensure wide accessibility for wheelchairs, baby strollers, and walkers of all endurance levels, civic consultations will review surface gradients, street lighting, and buffer lanes before final route approval.',
      isSample: true,
    },
  ],

  faqs: [
    {
      id: 'faq-1',
      question: 'What is the tentative timeline for Walkathon 2027?',
      answer:
        'The walkathon is tentatively scheduled for mid-January 2027 on a weekend morning. The exact date is subject to final municipal permissions and traffic coordination, and will be officially published here once ratified.',
      category: 'Event Day',
      isTentative: true,
    },
    {
      id: 'faq-2',
      question: 'How do I register, and is there any fee?',
      answer:
        'Initial pre-registration in Phase 1 is conducted completely free of charge through our official Google Forms link. There are no online payments, hidden processing charges, or commercial commitments.',
      category: 'Registration',
      isTentative: false,
    },
    {
      id: 'faq-3',
      question: 'Who can participate in the Walkathon?',
      answer:
        'The event is designed to be universally accessible. We offer three proposed categories: the 3K Harmony Stride (all ages & families), the 5K Fitness Challenge (beginners to active walkers), and the 10K Endurance Stride (experienced walkers).',
      category: 'Participation',
      isTentative: true,
    },
    {
      id: 'faq-4',
      question: 'What safety and medical measures are being planned?',
      answer:
        'Safety is our utmost priority. The course design includes dedicated emergency medical posts every 1.5 km, mobile paramedic units, frequent water & electrolyte stations, and dedicated marshals for crowd guidance.',
      category: 'Safety & Medical',
      isTentative: false,
    },
    {
      id: 'faq-5',
      question: 'Will participants receive a finisher medal or certificate?',
      answer:
        'Yes. All registered participants who complete their chosen route will be awarded a commemorative event medal and a downloadable digital participation certificate. Final medal designs will be previewed closer to the event.',
      category: 'Event Day',
      isTentative: true,
    },
    {
      id: 'faq-6',
      question: 'Can I volunteer or support the organizing committee?',
      answer:
        'Yes! Community volunteers are the backbone of this movement. Volunteer intake and medical support team registrations will open once venue and date permissions are formally confirmed.',
      category: 'Participation',
      isTentative: true,
    },
  ],

  navLinks: [
    { label: 'The Journey', href: '#story' },
    { label: 'Mission', href: '#mission' },
    { label: 'Highlights', href: '#highlights' },
    { label: 'Announcements', href: '#announcements' },
    { label: 'FAQs', href: '#faq' },
    { label: 'Register', href: '#register', isCta: true },
  ],

  socialLinks: [
    { platform: 'Instagram', url: 'https://instagram.com/provisional_walkathon', isProvisional: true },
    { platform: 'Twitter', url: 'https://twitter.com/provisional_walkathon', isProvisional: true },
    { platform: 'YouTube', url: 'https://youtube.com/provisional_walkathon', isProvisional: true },
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/provisional_walkathon', isProvisional: true },
  ],

  contact: {
    inquiryEmail: 'coordination@walkathon2027-preview.org',
    committeeDesk: 'Organizing Working Committee Secretariat',
    hours: 'Monday – Friday, 10:00 AM – 5:00 PM IST',
    notice: 'Provisional contact channel during pre-launch phase. Official helpline will activate with formal launch.',
  },

  legalDisclaimer:
    'Disclaimer: This website represents Phase 1 pre-launch creative architecture. Event identity, dates, routes, and organizational affiliations are provisional and subject to formal organizer ratification and municipal approvals.',
};
