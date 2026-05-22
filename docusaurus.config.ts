import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Ceycode Engineering Knowledgebase',
  tagline: 'How we build, ship, and operate things at Ceycode',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // TODO: update to the actual production URL before deploying
  url: 'https://knowledgebase.ceycode.com',
  baseUrl: '/',

  organizationName: 'ceycode',
  projectName: 'knowledgebase',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/', // serve docs at site root
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/ceycode/knowledgebase/tree/main/',
        },
        blog: false, // no blog section
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Ceycode KB',
      logo: {
        alt: 'Ceycode Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/ceycode/knowledgebase',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Team',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/ceycode',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ceycode. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'java', 'yaml', 'json', 'sql'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
