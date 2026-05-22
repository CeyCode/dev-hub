import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type Topic = {
  label: string;
  href: string;
  icon: ReactNode;
};

const topics: Topic[] = [
  {
    label: 'Languages',
    href: '/kb/languages/java',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    label: 'Frameworks',
    href: '/kb/frameworks/react',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    label: 'Tools',
    href: '/kb/tools/docker',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    label: 'Concepts',
    href: '/kb/concepts/system-design',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    label: 'Best Practices',
    href: '/kb/best-practices/code-review',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    label: 'Articles & TILs',
    href: '/blog',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
];

type Pillar = {
  title: string;
  description: string;
  icon: ReactNode;
};

const pillars: Pillar[] = [
  {
    title: 'Share Knowledge',
    description:
      'Capture what you learn — tutorials, deep dives, gotchas, and TILs — so the next person on the team can skip the struggle.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    title: 'Empower Developers',
    description:
      'Battle-tested patterns, language tips, and best practices that help every engineer ship better code, faster.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: 'Collaborative Community',
    description:
      'A living hub built by the team, for the team. Open a PR, drop a TIL, or polish an existing guide — every contribution counts.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

type TechIcon = {
  name: string;
  slug: string;
  color: string;
};

const techIcons: TechIcon[] = [
  {name: 'JavaScript', slug: 'javascript', color: 'F7DF1E'},
  {name: 'TypeScript', slug: 'typescript', color: '3178C6'},
  {name: 'Python', slug: 'python', color: '3776AB'},
  {name: 'Java', slug: 'openjdk', color: 'F58219'},
  {name: 'Go', slug: 'go', color: '00ADD8'},
  {name: 'Rust', slug: 'rust', color: 'DEA584'},
  {name: 'C++', slug: 'cplusplus', color: '00599C'},
  {name: 'Ruby', slug: 'ruby', color: 'CC342D'},
  {name: 'PHP', slug: 'php', color: '777BB4'},
  {name: 'Swift', slug: 'swift', color: 'F05138'},
  {name: 'Kotlin', slug: 'kotlin', color: '7F52FF'},
  {name: 'React', slug: 'react', color: '61DAFB'},
  {name: 'Vue.js', slug: 'vuedotjs', color: '4FC08D'},
  {name: 'Angular', slug: 'angular', color: 'DD0031'},
  {name: 'Svelte', slug: 'svelte', color: 'FF3E00'},
  {name: 'Next.js', slug: 'nextdotjs', color: 'FFFFFF'},
  {name: 'Nuxt', slug: 'nuxt', color: '00DC82'},
  {name: 'Node.js', slug: 'nodedotjs', color: '5FA04E'},
  {name: 'Spring', slug: 'spring', color: '6DB33F'},
  {name: 'Django', slug: 'django', color: '092E20'},
  {name: 'Flutter', slug: 'flutter', color: '02569B'},
  {name: 'Docker', slug: 'docker', color: '2496ED'},
  {name: 'Kubernetes', slug: 'kubernetes', color: '326CE5'},
  {name: 'Git', slug: 'git', color: 'F05032'},
  {name: 'GitHub', slug: 'github', color: 'FFFFFF'},
  {name: 'Linux', slug: 'linux', color: 'FCC624'},
  {name: 'Terraform', slug: 'terraform', color: '844FBA'},
  {name: 'PostgreSQL', slug: 'postgresql', color: '4169E1'},
  {name: 'MongoDB', slug: 'mongodb', color: '47A248'},
  {name: 'Redis', slug: 'redis', color: 'FF4438'},
  {name: 'GraphQL', slug: 'graphql', color: 'E10098'},
  {name: 'Tailwind CSS', slug: 'tailwindcss', color: '06B6D4'},
  {name: 'Vite', slug: 'vite', color: '646CFF'},
  {name: 'Webpack', slug: 'webpack', color: '8DD6F9'},
  {name: 'npm', slug: 'npm', color: 'CB3837'},
  {name: 'Firebase', slug: 'firebase', color: 'FFCA28'},
];

function TechRow({
  icons,
  direction,
  duration,
}: {
  icons: TechIcon[];
  direction: 'left' | 'right';
  duration: number;
}): ReactNode {
  // Repeat the icon set 4× so the visible track is always wider than the
  // viewport, keeping the -50% loop perfectly seamless at any screen size.
  const track = [...icons, ...icons, ...icons, ...icons];
  return (
    <div className={styles.techRow}>
      <div
        className={styles.techTrack}
        data-direction={direction}
        style={{animationDuration: `${duration}s`}}>
        {track.map((icon, idx) => (
          <div className={styles.techTile} key={`${icon.slug}-${idx}`} title={icon.name}>
            <img
              src={`https://cdn.simpleicons.org/${icon.slug}/${icon.color}`}
              alt=""
              loading="lazy"
              width={28}
              height={28}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function TechBackdrop(): ReactNode {
  const rowOne = techIcons.slice(0, 12);
  const rowTwo = techIcons.slice(12, 24);
  const rowThree = techIcons.slice(24, 36);
  return (
    <div className={styles.techBackdrop} aria-hidden="true">
      <TechRow icons={rowOne} direction="left" duration={140} />
      <TechRow icons={rowTwo} direction="right" duration={175} />
      <TechRow icons={rowThree} direction="left" duration={210} />
    </div>
  );
}

function HeroBackdrop(): ReactNode {
  return (
    <div className={styles.heroBackdrop} aria-hidden="true">
      <TechBackdrop />
      <div className={styles.orbOne} />
      <div className={styles.orbTwo} />
      <div className={styles.orbThree} />
      <div className={styles.heroVignette} />
    </div>
  );
}

function Hero(): ReactNode {
  return (
    <header className={styles.hero}>
      <HeroBackdrop />
      <div className={styles.heroInner}>
        <Heading as="h1" className={styles.heroTitle}>
          Ceycode <span className={styles.heroAccent}>Dev Hub</span>
        </Heading>
        <p className={styles.heroSubtitle}>
          A living knowledge base built by the team, for the team. Share what
          you&apos;ve learned, discover what others know, and grow together.
        </p>
        <div className={styles.ctaRow}>
          <Link className={styles.ctaPrimary} to="/kb/welcome">
            Explore the Knowledge Base
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link className={styles.ctaSecondary} to="/blog">
            Read the latest articles
          </Link>
        </div>
      </div>
    </header>
  );
}

function Pillars(): ReactNode {
  return (
    <section className={styles.pillars}>
      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Why this hub exists</span>
          <Heading as="h2" className={styles.sectionTitle}>
            Built around three simple ideas
          </Heading>
          <p className={styles.sectionLead}>
            Every page here exists to make the team faster, sharper, and more
            connected — one shared insight at a time.
          </p>
        </div>
        <div className={styles.pillarGrid}>
          {pillars.map((pillar) => (
            <article key={pillar.title} className={styles.pillarCard}>
              <div className={styles.pillarIcon}>{pillar.icon}</div>
              <Heading as="h3" className={styles.pillarTitle}>
                {pillar.title}
              </Heading>
              <p className={styles.pillarDescription}>{pillar.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Topics(): ReactNode {
  return (
    <section className={styles.topics}>
      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>What lives here</span>
          <Heading as="h2" className={styles.sectionTitle}>
            Jump straight into a topic
          </Heading>
          <p className={styles.sectionLead}>
            Languages, frameworks, tooling, system design, team-agreed best
            practices, and time-stamped TILs — all in one place.
          </p>
        </div>
        <div className={styles.topicGrid}>
          {topics.map((topic) => (
            <Link key={topic.label} to={topic.href} className={styles.topicCard}>
              <span className={styles.topicIcon}>{topic.icon}</span>
              <span className={styles.topicLabel}>{topic.label}</span>
              <span className={styles.topicArrow} aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContributeCTA(): ReactNode {
  return (
    <section className={styles.contribute}>
      <div className={styles.sectionContainer}>
        <div className={styles.contributeCard}>
          <div className={styles.contributeText}>
            <span className={styles.sectionEyebrow}>Contribute</span>
            <Heading as="h2" className={styles.contributeTitle}>
              Learned something? Pass it on.
            </Heading>
            <p className={styles.contributeLead}>
              Every TIL, tutorial, and best-practice page started with one
              engineer choosing to write it down. Take ten minutes, grab a
              template, and help the next person move faster.
            </p>
          </div>
          <div className={styles.contributeActions}>
            <Link className={styles.ctaPrimary} to="/kb/contributing">
              How to contribute
            </Link>
            <Link className={styles.ctaSecondary} to="/kb/templates/til">
              Use a template
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description={`${siteConfig.title} — ${siteConfig.tagline}`}>
      <main className={styles.main}>
        <Hero />
        <Pillars />
        <Topics />
        <ContributeCTA />
      </main>
    </Layout>
  );
}
