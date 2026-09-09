/**
 * The Learn curriculum: which walkthroughs belong to which section, and in
 * what order the sections appear in the sidebar.
 *
 * This is the ONE file to edit when the training team adds material. The
 * videogen repo owns house style and narration; it has no notion of
 * curriculum, so the grouping lives here.
 *
 *   - New video in an existing section -> add its slug to that section.
 *   - New section                      -> add an entry to SECTIONS.
 *
 * A generated walkthrough whose slug is listed nowhere still ships: it lands
 * in UNLISTED_SECTION and `npm run sync-videos` warns about it. Better a new
 * walkthrough in the wrong place than one that silently never publishes.
 */

export const SECTIONS = [
  {
    dir: 'get-started',
    label: 'Get started',
    description: 'Find your way around the Workbench.',
    // create-counterparty-demo is deliberately absent: it is filmed against a
    // fake HTML form used to test the generator offline, not against OpenTRMS.
    slugs: ['00-getting-started'],
  },
  {
    dir: 'trading',
    label: 'Trading',
    description: 'Capture deals, work the blotter, and read what your book adds up to.',
    // 01-fx-spot is parked upstream — the FX ticket cannot book (details.*
    // numerics sent as strings). Reinstate it here when it is generated again.
    slugs: ['02-bond-workbook', '03-deal-list', '04-positions', '05-approvals-roles'],
  },
  {
    dir: 'market-data',
    label: 'Market data & valuation',
    description: 'Curves, indices and fixings — the inputs a valuation runs on.',
    slugs: ['06-run-valuation', '07-curve-viewer', '08-market-index', '09-fixings', '10-instruments'],
  },
  {
    dir: 'post-trade',
    label: 'Post-trade',
    description: 'Settlement, netting and the accounting that follows a trade.',
    slugs: ['11-settlements', '12-instruct-settlement', '13-netting', '14-journals', '15-period-close'],
  },
  {
    dir: 'administration',
    label: 'Administration',
    description: 'Users, access policy, reference data and the audit trail.',
    slugs: ['16-user-access', '17-access-policy', '18-parties-calendars', '19-automation-audit'],
  },
];

/** Where walkthroughs land when no section claims them. */
export const UNLISTED_SECTION = {
  dir: 'unsorted',
  label: 'Unsorted',
  description: 'Walkthroughs not yet assigned to a section in scripts/learn-sections.mjs.',
  slugs: [],
};
