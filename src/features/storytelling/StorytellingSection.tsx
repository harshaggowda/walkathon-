import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Footprints, Users, HeartHandshake, Compass } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/event.config';
import styles from './StorytellingSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export const StorytellingSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item) => {
        if (!item) return;

        const visual = item.querySelector(`.${styles.storyVisual}`);
        const content = item.querySelector(`.${styles.storyContent}`);

        gsap.fromTo(
          [content, visual],
          {
            opacity: 0,
            y: 45,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getVisualSvg = (index: number) => {
    switch (index) {
      case 0:
        return (
          <svg viewBox="0 0 200 120" width="100%" height="100%" fill="none">
            <circle cx="100" cy="60" r="14" fill="#FF5722" />
            <circle cx="100" cy="60" r="32" stroke="#FF7043" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
            <circle cx="100" cy="60" r="50" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.4" />
          </svg>
        );
      case 1:
        return (
          <svg viewBox="0 0 200 120" width="100%" height="100%" fill="none">
            <path d="M 20 80 Q 70 30, 100 60 T 180 40" stroke="#FF5722" strokeWidth="6" strokeLinecap="round" />
            <path d="M 20 95 Q 70 45, 100 75 T 180 55" stroke="#F5A623" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            <circle cx="60" cy="55" r="5" fill="#FFFFFF" />
            <circle cx="100" cy="60" r="5" fill="#FFFFFF" />
            <circle cx="140" cy="50" r="5" fill="#FFFFFF" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 200 120" width="100%" height="100%" fill="none">
            <path d="M 30 100 L 170 100" stroke="#8292AD" strokeWidth="2" />
            <circle cx="100" cy="70" r="26" fill="#F5A623" opacity="0.85" />
            <path d="M 50 100 L 70 65 L 90 100" fill="#131E38" />
            <path d="M 85 100 L 105 50 L 125 100" fill="#1A294C" />
            <path d="M 120 100 L 140 70 L 160 100" fill="#131E38" />
          </svg>
        );
    }
  };

  const getPhaseIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Footprints size={18} />;
      case 1:
        return <Users size={18} />;
      default:
        return <HeartHandshake size={18} />;
    }
  };

  return (
    <section
      id="story"
      ref={sectionRef}
      className={styles.storyWrapper}
      aria-label="The Walkathon Story and Vision"
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Compass size={14} />
            <span>The Journey Ahead</span>
          </div>
          <h2 className="section-title">From A Single Spark to 10,000 Unified Steps</h2>
          <p className="section-lead">
            Every monumental movement is powered by ordinary people stepping out of their routines to share a common course.
          </p>
        </div>

        {/* Story Milestones Track */}
        <div className={styles.timelineTrackContainer}>
          <div className={styles.timelineCenterLine} aria-hidden="true" />

          {EVENT_CONFIG.storyline.map((item, index) => {
            const isReverse = index % 2 === 1;
            return (
              <div
                key={item.number}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                className={`${styles.storyItem} ${isReverse ? styles.storyItemReverse : ''}`}
              >
                {/* Visual Card */}
                <div className={styles.storyVisual}>
                  <div className={styles.visualCard}>
                    <div className={styles.visualGraphic} aria-hidden="true">
                      {getVisualSvg(index)}
                    </div>
                    <div className={styles.visualMetric}>
                      <span className={styles.metricValue}>{item.metricValue}</span>
                      <span className={styles.metricLabel}>{item.metricLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={styles.storyContent}>
                  <div className={styles.storyPhaseBadge}>
                    <span className={styles.stepNumber}>{item.number}</span>
                    <span className={styles.phaseTitle}>
                      {getPhaseIcon(index)}
                      <span style={{ marginLeft: '0.4rem' }}>{item.phase}</span>
                    </span>
                  </div>

                  <h3 className={styles.storyHeadline}>{item.headline}</h3>
                  <p className={styles.storyLead}>{item.lead}</p>
                  <p className={styles.storyDescription}>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
