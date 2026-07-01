import React from 'react';
import Layout from '@theme-original/ApiItem/Layout';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import StatusBadge from '@site/src/components/StatusBadge';

// The OpenAPI plugin uses this Layout as the doc item for *every* docs page
// (it's wired in as `docItemComponent`). The generated API reference pages
// therefore lack the eyebrow + status row that the hand-authored docs
// (Quickstart, Schemas, Cookbook) render at the top. We inject that same
// markup here so the API pages share the identical header design — but only
// for pages under /reference/api, so we don't double up on the authored docs
// that already include their own eyebrow/StatusBadge in MDX.
export default function LayoutWrapper(props: {children?: React.ReactNode}) {
  const {metadata} = useDoc();
  const isApiReference = metadata.permalink?.includes('/reference/api/');

  if (!isApiReference) {
    return <Layout {...props} />;
  }

  return (
    <Layout {...props}>
      <div className="eyebrow">API Reference</div>
      <StatusBadge status="draft" reviewed="2026-06-23" />
      {props.children}
    </Layout>
  );
}
