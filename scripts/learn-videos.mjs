/**
 * Slug -> YouTube video ID for the Learn walkthroughs.
 *
 * The videos are uploaded to YouTube (unlisted is fine — unlisted videos embed
 * normally) and mapped here by the slug of the scenario that produced them.
 * Either a bare id or a full YouTube URL works — paste the share link straight
 * from the upload and the sync script pulls the id out of it.
 *
 * A slug with no entry here is not an error: the page falls back to the local
 * .mp4 copy, so a freshly generated walkthrough is previewable at `npm start`
 * before anyone uploads it. `npm run sync-videos` lists what is unmapped.
 *
 * Re-recording a walkthrough means a NEW upload and a NEW id — YouTube cannot
 * replace the file behind an existing video. Update the id here when you do.
 */
export const YOUTUBE_IDS = {
  '00-getting-started': 'https://youtu.be/70E3VybQElA',
  '02-bond-workbook': 'https://youtu.be/yNKESl13j8I',
  '03-deal-list': 'https://youtu.be/w3OtQnRTFHg',
  '04-positions': 'https://youtu.be/YTOi0J-0ocE',
  '05-approvals-roles': 'https://youtu.be/hMgoL0Vfeas',
  '06-run-valuation': 'https://youtu.be/6VIgQ-joZHE',
  '07-curve-viewer': 'https://youtu.be/f0THOCm3bdI',
  '08-market-index': 'https://youtu.be/PhxcqWjxWU0',
  '09-fixings': 'https://youtu.be/mY1qarbGFFw',
  '10-instruments': 'https://youtu.be/2vZ_RPNH138',
  // '11-settlements': '',
  // '12-instruct-settlement': '',
  // '13-netting': '',
  // '14-journals': '',
  // '15-period-close': '',
  // '16-user-access': '',
  // '17-access-policy': '',
  // '18-parties-calendars': '',
  // '19-automation-audit': '',
};
