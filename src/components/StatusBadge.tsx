import React from 'react';

const STYLES: Record<string, {label: string; bg: string; fg: string; bd: string}> = {
  stable:     {label: 'Stable',     bg: 'rgba(53,214,164,0.12)',  fg: '#35d6a4', bd: 'rgba(53,214,164,0.35)'},
  draft:      {label: 'Draft',      bg: 'rgba(214,182,53,0.12)',  fg: '#d6b635', bd: 'rgba(214,182,53,0.35)'},
  proposal:   {label: 'Proposal',   bg: 'rgba(122,162,247,0.12)', fg: '#7aa2f7', bd: 'rgba(122,162,247,0.35)'},
  planned:    {label: 'Planned',    bg: 'rgba(125,134,145,0.12)', fg: '#9aa2ad', bd: 'rgba(125,134,145,0.30)'},
  deprecated: {label: 'Deprecated', bg: 'rgba(247,118,142,0.12)', fg: '#f7768e', bd: 'rgba(247,118,142,0.35)'},
};

export default function StatusBadge({status = 'draft', reviewed}: {status?: string; reviewed?: string}) {
  const s = STYLES[status] ?? STYLES.draft;
  return (
    <span className="status-row">
      <span className="status-badge" style={{background: s.bg, color: s.fg, borderColor: s.bd}}>{s.label}</span>
      {reviewed ? <span className="status-reviewed">Last reviewed {reviewed}</span> : null}
    </span>
  );
}
