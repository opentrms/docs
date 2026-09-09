import React, {type ReactNode} from 'react';
import styles from './styles.module.css';

type Props = {
  /** Absolute URL, or a /learn/... path when videos are served locally. */
  video?: string | null;
  /** WebVTT captions. SRT is not a valid <track> source. */
  captions?: string | null;
  poster?: string | null;
  /** Human-readable runtime, e.g. "1m 57s". */
  duration?: string | null;
  /** The narration, rendered as a collapsible transcript. */
  children?: ReactNode;
};

/**
 * The header of every generated Learn page: the walkthrough video, and the
 * narration below it as text.
 *
 * The transcript is on the page rather than only inside the video because the
 * search index reads page text — without it, everything said aloud is
 * unfindable.
 */
export default function Walkthrough({
  video,
  captions,
  poster,
  duration,
  children,
}: Props): ReactNode {
  return (
    <div className={styles.walkthrough}>
      {video ? (
        <video
          className={styles.video}
          controls
          preload="metadata"
          poster={poster ?? undefined}
          playsInline>
          <source src={video} type="video/mp4" />
          {/* Not `default`: the series currently burns captions into the
              video (burnCaptions in _series.workbench.yaml), so switching this
              track on by hand would show them twice. Add `default` back once
              the videos are re-rendered without burned-in captions. */}
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
