import React, {type ReactNode, useState} from 'react';
import styles from './styles.module.css';

type Props = {
  /** YouTube video id. Takes precedence over `video` when both are set. */
  youtube?: string | null;
  /** Absolute URL, or a /learn/... path when videos are served locally. */
  video?: string | null;
  /** WebVTT captions, for the self-hosted player only. SRT is not valid here. */
  captions?: string | null;
  poster?: string | null;
  /** Human-readable runtime, e.g. "1m 57s". */
  duration?: string | null;
  /** The narration, rendered as a collapsible transcript. */
  children?: ReactNode;
};

/**
 * The YouTube player is loaded on click rather than on page load: embedding it
 * directly pulls ~1 MB of player and sets third-party cookies on every Learn
 * page whether or not anyone watches. Until then this is the poster frame we
 * already generate, so the page looks the same either way.
 */
function YouTubeEmbed({id, poster, title}: {id: string; poster?: string | null; title: string}) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        className={styles.video}
        // nocookie: no third-party cookie until the viewer chooses to play.
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className={styles.facade}
      onClick={() => setActive(true)}
      style={poster ? {backgroundImage: `url(${poster})`} : undefined}
      aria-label={`Play video: ${title}`}>
      <span className={styles.playIcon} aria-hidden="true">▶</span>
    </button>
  );
}

/**
 * The header of every generated Learn page: the walkthrough video, and the
 * narration below it as text.
 *
 * The transcript is on the page rather than only inside the video because the
 * search index reads page text — without it, everything said aloud is
 * unfindable.
 */
export default function Walkthrough({
  youtube,
  video,
  captions,
  poster,
  duration,
  children,
}: Props): ReactNode {
  return (
    <div className={styles.walkthrough}>
      {youtube ? (
        <YouTubeEmbed id={youtube} poster={poster} title="Walkthrough" />
      ) : video ? (
        <video
          className={styles.video}
          controls
          preload="metadata"
          poster={poster ?? undefined}
          playsInline>
          <source src={video} type="video/mp4" />
          {/* Not `default`: the series currently burns captions into the video
              (burnCaptions in _series.workbench.yaml), so switching this track
              on by hand would show them twice. Add `default` back once the
              videos are re-rendered without burned-in captions. */}
          {captions ? (
            <track kind="captions" srcLang="en" label="English" src={captions} />
          ) : null}
        </video>
      ) : (
        <p className={styles.missing}>
          The video for this walkthrough is not published yet. The steps below
          cover the same ground.
        </p>
      )}

      {children ? (
        <details className={styles.transcript}>
          <summary className={styles.summary}>
            Transcript
            {duration ? <span className={styles.duration}>{duration}</span> : null}
          </summary>
          <div className={styles.transcriptBody}>{children}</div>
        </details>
      ) : null}
    </div>
  );
}
