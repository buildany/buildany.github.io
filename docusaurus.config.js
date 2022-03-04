// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Buildany',
  tagline: 'Build anything!',
  url: "https://buildany.github.io",
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'buildany',
  projectName: 'WEBSITE',
  deploymentBranch: 'main',
  trailingSlash: false,
  themes: [
    '@buildany/theme-codeblock-source',
    [require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,       
      },
  ]],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/kkateq/blog',
          remarkPlugins: [require('mdx-mermaid')],
        },
        blog: {
          routeBasePath: '/',
          showReadingTime: true,
          editUrl:
            'https://github.com/kkateq/blog',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'build:any',
       logo: {
          alt: 'My Site Logo',
          src: 'img/Logo32x32.svg',
        },
        items: [
          {to: '/', label: 'Home', position: 'left'},
          {type:'doc', docId: 'intro', label: 'Tutorials', position: 'left'}
        ],
      },
      footer: {
        style: 'light',
        links: [
        ],
        copyright: `Copyright © ${new Date().getFullYear()} buildany. Built with Docusaurus.`,
      },
      prism: {
        // theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['solidity'],
      },
    }),
};

module.exports = config;
