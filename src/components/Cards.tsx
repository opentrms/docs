import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';

export function CardGrid({children}: {children: ReactNode}): ReactNode {
  return <div className="card-grid">{children}</div>;
}

export function Card({
  to,
  title,
  children,
}: {
  to: string;
  title: string;
  children: ReactNode;
}): ReactNode {
  return (
    <Link className="doc-card" to={to}>
      <div className="doc-card__title">{title} →</div>
      <div className="doc-card__body">{children}</div>
    </Link>
  );
}
