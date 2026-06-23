import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const apiSidebar = require('./docs/reference/api/sidebar.ts').default;

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {type: 'category', label: 'Overview', collapsible: false, items: [
      'overview/quickstart', 'overview/principles', 'overview/architecture', 'overview/asset-coverage',
    ]},
    {type: 'category', label: 'Concepts', collapsible: false, items: [
      'concepts/event-sourcing', 'concepts/event-store', 'concepts/hash-chain', 'concepts/deal-state-machine',
      'concepts/capture-stp', 'concepts/approval-chains', 'concepts/valuation', 'concepts/accounting',
      'concepts/settlement-netting', 'concepts/closeout', 'concepts/end-of-day', 'concepts/agent-runtime',
    ]},
    {type: 'category', label: 'Guides', collapsible: false, items: [
      'guides/run-locally', 'guides/setup', 'guides/operate-eod', 'guides/book-a-trade',
      'guides/drive-via-mcp', 'guides/verify-audit',
    ]},
    {type: 'category', label: 'Extend', collapsible: false, items: [
      'extend/spi-contracts', 'extend/product-valuator', 'extend/tck', 'extend/new-product-playbook',
      'extend/schema-authoring', 'extend/extensibility-model',
    ]},
  ],
  referenceSidebar: [
    {
      type: 'category',
      label: 'API Reference',
      collapsible: false,
      items: apiSidebar,
    },
    {type: 'category', label: 'Reference', collapsible: false, items: [
      'reference/schema-catalog', 'reference/data-dictionary', 'reference/erd',
      'reference/scopes', 'reference/cli', 'reference/mcp-tools', 'reference/conventions', 'reference/cookbook',
    ]},
  ],
};

export default sidebars;
