import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Ceycode Dev Hub',
  tagline: 'Knowledge shared, skills grown',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://CeyCode.github.io',
  baseUrl: '/dev-hub/',

  organizationName: 'CeyCode',
  projectName: 'dev-hub',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    mdx1Compat: {
      admonitions: true,
    },
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/kb',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/CeyCode/dev-hub/tree/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          blogSidebarTitle: 'Recent articles',
          blogSidebarCount: 15,
          postsPerPage: 10,
          editUrl: 'https://github.com/CeyCode/dev-hub/tree/main/',
        },
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
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'Ceycode Dev Hub',
      logo: {
        alt: 'Ceycode Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'right',
          label: 'Knowledge Base',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'right',
        },
        {
          to: '/kb/tags',
          label: 'Tags',
          position: 'right',
        },
        {
          to: '/kb/contributing',
          label: 'Contribute',
          position: 'right',
        },
        {
          href: 'https://github.com/CeyCode/dev-hub',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Explore',
          items: [
            {label: 'Languages', to: '/kb/languages/java'},
            {label: 'Frameworks', to: '/kb/frameworks/react'},
            {label: 'Tools', to: '/kb/tools/docker'},
            {label: 'Concepts', to: '/kb/concepts/system-design'},
            {label: 'Best Practices', to: '/kb/best-practices/code-review'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'Blog', to: '/blog'},
            {label: 'How to Contribute', to: '/kb/contributing'},
            {label: 'GitHub', href: 'https://github.com/CeyCode/dev-hub'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ceycode Engineering. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'java', 'yaml', 'json', 'sql', 'python', 'go', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
