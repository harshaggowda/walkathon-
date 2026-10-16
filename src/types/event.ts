/**
 * Strongly-typed definitions for the Walkathon event configuration and content.
 * Designed for modularity and seamless future replacement with a NestJS API / PostgreSQL backend.
 */

export type StatusTag = 'confirmed' | 'tentative' | 'tba';

export interface EventBranding {
  name: string;
  shortName: string;
  organizerName: string;
  isOrganizerTentative: boolean;
  edition: string;
  headline: string;
  subheadline: string;
  supportingLine: string;
  badgeText: string;
}

export interface EventTiming {
  displayDate: string;
  monthYear: string;
  tentativeDate: string;
  timeZone: string;
  isDateFinalized: boolean;
  countdownTargetISO?: string; // Optional if not finalized
}

export interface EventLocation {
  city: string;
  state: string;
  venueName: string;
  isVenueFinalized: boolean;
  statusNote: string;
}

export interface EventScale {
  targetRegistrations: number;
  expectedParticipants: number;
  peakArrivalRate: string;
  distanceCategories: {
    id: string;
    name: string;
    distanceKm: number;
    description: string;
    eligibility: string;
    isTentative: boolean;
  }[];
}

export interface RegistrationConfig {
  mode: 'google-forms-link' | 'google-forms-embed' | 'coming-soon';
  googleFormsUrl: string;
  isUrlPlaceholder: boolean;
  instructions: string;
  participationFeeNotice: string;
  allowEmbedPreview: boolean;
}

export interface HighlightItem {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  status: StatusTag;
  statusLabel: string;
}

export interface StoryMilestone {
  number: string;
  phase: string;
  headline: string;
  lead: string;
  description: string;
  metricLabel: string;
  metricValue: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Official' | 'Route & Venue' | 'Registration' | 'Community' | 'Health & Safety';
  date: string;
  summary: string;
  body: string;
  isSample: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Registration' | 'Event Day' | 'Safety & Medical' | 'Participation';
  isTentative: boolean;
}

export interface NavLink {
  label: string;
  href: string;
  isCta?: boolean;
}

export interface SocialLink {
  platform: 'Instagram' | 'Twitter' | 'YouTube' | 'LinkedIn' | 'Facebook';
  url: string;
  isProvisional: boolean;
}

export interface ContactInfo {
  inquiryEmail: string;
  committeeDesk: string;
  hours: string;
  notice: string;
}

export interface EventConfig {
  branding: EventBranding;
  timing: EventTiming;
  location: EventLocation;
  scale: EventScale;
  registration: RegistrationConfig;
  highlights: HighlightItem[];
  storyline: StoryMilestone[];
  announcements: Announcement[];
  faqs: FaqItem[];
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  contact: ContactInfo;
  legalDisclaimer: string;
}
