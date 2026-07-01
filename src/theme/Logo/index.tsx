import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig} from '@docusaurus/theme-common';
import type {Props} from '@theme/Logo';

// URL of the marketing site the docs live under. Clicking the navbar wordmark
// takes visitors back there, mirroring the site's own header.
const MAIN_SITE_URL = 'https://opentrms.com';

// Swizzled (ejected) from @docusaurus/theme-classic.
// Differences from the default Logo:
//  - renders the wordmark only (no logo image), matching the marketing header
//  - links to the main site instead of the docs home page
export default function Logo(props: Props): ReactNode {
  const {
    siteConfig: {title},
  } = useDocusaurusContext();
  const {
    navbar: {title: navbarTitle},
  } = useThemeConfig();
  const {imageClassName, titleClassName, ...propsRest} = props;
  return (
    // href + target="_self" so the brand navigates in the same tab. Docusaurus
    // <Link> otherwise treats this external URL as a new-tab link.
    <Link href={MAIN_SITE_URL} target="_self" {...propsRest}>
      <b className={titleClassName}>{navbarTitle ?? title}</b>
    </Link>
  );
}
