/**
 * Slug -> YouTube video ID for the Learn walkthroughs.
 *
 * The videos are uploaded to YouTube (unlisted is fine — unlisted videos embed
 * normally) and mapped here by the slug of the scenario that produced them.
 * The ID is the part after `v=` in the watch URL, or the last path segment of
 * a youtu.be link.
 *
 * A slug with no entry here is not an error: the page falls back to the local
 * .mp4 copy, so a freshly generated walkthrough is previewable at `npm start`
 * before anyone uploads it. `npm run sync-videos` lists what is unmapped.
 *
 * Re-recording a walkthrough means a NEW upload and a NEW id — YouTube cannot
 * replace the file behind an existing video. Update the id here when you do.
 */
export const YOUTUBE_IDS = {
  // 'getting-started': 'dQw4w9WgXcQ',
  // 'create-counterparty-demo': '...',
  // 'deal-list': '...',
};
