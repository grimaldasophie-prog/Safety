import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { IconFilm, IconPlay } from './Icons';

export interface VideoHandle {
  play: () => void;
}

/**
 * Plays a local video from /public/videos. If the file isn't on the device,
 * shows a calm placeholder instead of a broken player.
 */
export const VideoPlayer = forwardRef<VideoHandle, { src: string; label: string; tone?: 'blue' | 'navy' }>(
  function VideoPlayer({ src, label, tone = 'navy' }, ref) {
    const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading');
    const [playing, setPlaying] = useState(false);
    const video = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      setState('loading');
      setPlaying(false);
    }, [src]);

    useImperativeHandle(ref, () => ({
      play: () => {
        if (state === 'ready') video.current?.play().catch(() => {});
      },
    }));

    const file = src.split('/').pop();
    const bg = tone === 'navy' ? 'bg-navy' : 'bg-blue';

    if (state === 'missing') {
      return (
        <div className={`relative aspect-video w-full overflow-hidden rounded-2xl ${bg}`}>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <circle cx="275" cy="35" r="70" fill="#0B3D91" opacity="0.55" />
            <circle cx="40" cy="170" r="55" fill="#0B3D91" opacity="0.45" />
            <rect x="0" y="150" width="320" height="4" fill="#FC3D21" opacity="0.9" />
            <rect x="0" y="157" width="320" height="2" fill="#fff" opacity="0.35" />
          </svg>
          <div className="relative flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-mist">
              <IconFilm size={22} />
            </div>
            <div className="font-display text-[16px] font-bold text-white">Video not on this device yet</div>
            <div className="text-[13px] text-mist">
              Add <span className="font-mono text-white/90">{file}</span> to /videos
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`relative aspect-video w-full overflow-hidden rounded-2xl ${bg}`}>
        <video
          ref={video}
          src={src}
          preload="metadata"
          playsInline
          controls={playing}
          aria-label={label}
          className="h-full w-full object-cover"
          onLoadedMetadata={() => setState('ready')}
          onError={() => setState('missing')}
          onPlay={() => setPlaying(true)}
        />
        {!playing && (
          <button
            onClick={() => video.current?.play().catch(() => setState('missing'))}
            aria-label={`Play ${label}`}
            disabled={state !== 'ready'}
            className="absolute inset-0 grid place-items-center"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-red text-white">
              <IconPlay size={26} />
            </span>
          </button>
        )}
      </div>
    );
  },
);
