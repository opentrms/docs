import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const GITHUB_URL = 'https://github.com/ichagas/OpenTRMS';
const ALGOLIA_APP_ID = process.env.DOCSEARCH_APP_ID;
const ALGOLIA_API_KEY = process.env.DOCSEARCH_API_KEY;
const ALGOLIA_INDEX_NAME = process.env.DOCSEARCH_INDEX_NAME;
const ALGOLIA_CONTEXTUAL_SEARCH = process.env.DOCSEARCH_CONTEXTUAL_SEARCH !== 'false';
const HAS_ALGOLIA_CONFIG = Boolean(ALGOLIA_APP_ID && ALGOLIA_API_KEY && ALGOLIA_INDEX_NAME);

const searchThemes: Config['themes'] = [
  '@docusaurus/theme-mermaid',
  'docusaurus-theme-openapi-docs',
];

if (!HAS_ALGOLIA_CONFIG) {
  searchThemes.push([
    require.resolve('@easyops-cn/docusaurus-search-local'),
    {
      hashed: true,
      indexBlog: false,
      docsRouteBasePath: '/',
      highlightSearchTermsOnTargetPage: true,
      explicitSearchResultPath: true,
      searchBarPosition: 'right',
    },
  ]);
}

const config: Config = {
  title: 'OpenTRMS',
  tagline: 'A self-hosted, open trade & risk management platform',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  // Served from the docs.opentrms.com custom domain (GitHub Pages).
  // The CNAME lives in static/CNAME so it is copied into every build.
  url: 'https://docs.opentrms.com',
  baseUrl: '/',

  organizationName: 'opentrms',
  projectName: 'opentrms-docs',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Load Inter + JetBrains Mono via real <link> tags in the head (matches the
  // trms-workbench product UI). A CSS @import is render-blocking and can fall
  // back to a system font on first paint, which reads as "the wrong font".
  headTags: [
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
  ],

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

  themes: searchThemes,

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
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    mermaid: {
      theme: {light: 'default', dark: 'dark'},
    },
    docs: {
      sidebar: {
        hideable: false,
        autoCollapseCategories: false,
      },
    },
    algolia: HAS_ALGOLIA_CONFIG
      ? {
          appId: ALGOLIA_APP_ID,
          apiKey: ALGOLIA_API_KEY,
          indexName: ALGOLIA_INDEX_NAME,
          contextualSearch: ALGOLIA_CONTEXTUAL_SEARCH,
        }
      : undefined,
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
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'json', 'sql', 'java', 'python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
