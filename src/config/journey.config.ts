export interface JourneyCheckpoint {
  id: string;
  number: string;
  progress: number; // Normalized road curve position 0 to 1
  tag: string;
  phase: string;
  headline: string;
  lead: string;
  description: string;
  metricValue: string;
  metricLabel: string;
  themeColor: string;
  badgeBg: string;
  iconName: 'Footprints' | 'Users' | 'Activity' | 'Award';
  illustrationType: 'step' | 'community' | 'movement' | 'finish';
  cta?: {
    label: string;
    href: string;
    isPrimary: boolean;
  };
}

/**
 * CENTRALIZED JOURNEY & CHECKPOINT CONFIGURATION
 * Single source of truth for the interactive walkathon road experience.
 * Organizers can freely adjust titles, descriptions, and checkpoints here.
 */
export const JOURNEY_CHECKPOINTS: JourneyCheckpoint[] = [
  {
    id: 'checkpoint-01',
    number: '01',
    progress: 0.15,
    tag: 'Checkpoint 01',
    phase: 'ONE STEP',
    headline: 'Every Journey Begins with One Step',
    lead: 'Every monumental movement is sparked by a solitary decision to move forward.',
    description:
      'The walkathon is built on one simple premise: you do not need to be an elite athlete to transform your life. It starts with lacing up your shoes, stepping off the porch, and joining hands with neighbors taking that same courage-filled first stride.',
    metricValue: '1 Step',
    metricLabel: 'Your Beginning',
    themeColor: '#FF5722', // Energetic Orange
    badgeBg: 'rgba(255, 87, 34, 0.12)',
    iconName: 'Footprints',
    illustrationType: 'step',
  },
  {
    id: 'checkpoint-02',
    number: '02',
    progress: 0.42,
    tag: 'Checkpoint 02',
    phase: 'TOGETHER',
    headline: 'A Community Moving Together',
    lead: 'When solitary steps converge, the boulevard becomes an arena of shared optimism.',
    description:
      'Walkathons erase barriers. Along the wide civic corridor, parents guide strollers, schoolchildren pace alongside grandparents, local fitness clubs cheer first-timers, and colleagues share smiles under the morning sun.',
    metricValue: '10,000+',
    metricLabel: 'Community Walkers',
    themeColor: '#0284C7', // Vibrant Sky Blue
    badgeBg: 'rgba(2, 132, 199, 0.12)',
    iconName: 'Users',
    illustrationType: 'community',
  },
  {
    id: 'checkpoint-03',
    number: '03',
    progress: 0.70,
    tag: 'Checkpoint 03',
    phase: 'MOVEMENT',
    headline: 'Make Movement Part of Life',
    lead: 'Walking is the most accessible, restorative activity for long-term vitality.',
    description:
      'A daily 30-minute brisk walk enhances cardiovascular wellness, clears mental fog, and boosts emotional resilience. Our 3K Harmony, 5K Fitness, and 10K Endurance courses provide a safe, supported threshold for every stamina level.',
    metricValue: '3K • 5K • 10K',
    metricLabel: 'Inclusive Courses',
    themeColor: '#10B981', // Fresh Vitality Green
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    iconName: 'Activity',
    illustrationType: 'movement',
  },
  {
    id: 'checkpoint-04',
    number: '04',
    progress: 0.94,
    tag: 'Checkpoint 04',
    phase: 'THE DESTINATION',
    headline: 'One Shared Destination',
    lead: 'Crossing the finish gateway is not the conclusion—it is your launchpad for life.',
    description:
      'The finish line welcomes every finisher with celebration, commemorative medals, hydration, and collective cheer. What begins on the January pavement transforms into enduring friendships and lifelong fitness habits.',
    metricValue: 'FINISH',
    metricLabel: 'Shared Victory',
    themeColor: '#F59E0B', // Golden Amber
    badgeBg: 'rgba(245, 158, 11, 0.14)',
    iconName: 'Award',
    illustrationType: 'finish',
    cta: {
      label: 'Register (Google Form)',
      href: '#register',
      isPrimary: true,
    },
  },
];
