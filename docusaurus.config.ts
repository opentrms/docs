import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const GITHUB_URL = 'https://github.com/ichagas/OpenTRMS';

const config: Config = {
  title: 'OpenTRMS',
  tagline: 'A self-hosted, open trade & risk management platform',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  // GitHub Pages project site for opentrms/opentrms-docs.
  url: 'https://opentrms.github.io',
  baseUrl: '/opentrms-docs/',

  organizationName: 'opentrms',
  projectName: 'opentrms-docs',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: [
    '@docusaurus/theme-mermaid',
    'docusaurus-theme-openapi-docs',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchBarPosition: 'right',
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: `${GITHUB_URL}/tree/main/`,
          breadcrumbs: false,
          docItemComponent: '@theme/ApiItem',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api',
        docsPluginId: 'classic',
        config: {
          trms: {
            specPath: 'static/openapi/trms-openapi.json',
            outputDir: 'docs/reference/api',
            sidebarOptions: {
              groupPathsBy: 'tag',
              categoryLinkSource: 'tag',
            },
          },
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/opentrms-social-card.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    // Site is dark-only; use Mermaid's dark palette so diagram text is legible.
    mermaid: {
      theme: {light: 'dark', dark: 'dark'},
    },
    docs: {
      sidebar: {
        hideable: false,
        autoCollapseCategories: false,
      },
    },
    navbar: {
      title: 'OpenTRMS',
      logo: {
        alt: 'OpenTRMS',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/reference/api/trms-api', label: 'API Reference', position: 'left'},
        {to: '/reference/schema-catalog', label: 'Schemas', position: 'left'},
        {to: '/reference/cookbook', label: 'Cookbook', position: 'left'},
        {
          href: GITHUB_URL,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Quickstart', to: '/'},
            {label: 'Architecture', to: '/overview/architecture'},
            {label: 'Asset coverage', to: '/overview/asset-coverage'},
          ],
        },
        {
          title: 'Platform',
          items: [
            {label: 'API Reference', to: '/reference/api/trms-api'},
            {label: 'Schemas', to: '/reference/schema-catalog'},
            {label: 'MCP server', to: '/guides/drive-via-mcp'},
          ],
        },
        {
          title: 'More',
          items: [{label: 'GitHub', href: GITHUB_URL}],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} OpenTRMS. Self-hosted, open source.`,
    },
    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'json', 'sql', 'java', 'python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
