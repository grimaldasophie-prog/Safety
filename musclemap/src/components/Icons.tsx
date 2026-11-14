import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 24, props: P) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
});

export const IconScan = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
    <path d="M4 12h16" />
  </svg>
);

export const IconBody = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="4.5" r="2.2" />
    <path d="M7 9h10M12 9v6M12 15l-3 6M12 15l3 6" />
  </svg>
);

export const IconPlan = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="5" y="4" width="14" height="17" rx="1.5" />
    <path d="M9 4V2.5h6V4M9 10h6M9 14h6M9 18h3" />
  </svg>
);

export const IconPath = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M6 21c0-4 12-3 12-7s-12-3-12-7c0-2 2-4 6-4" />
    <path d="M14 3h5l-1.5 2L19 7h-5" fill="currentColor" />
  </svg>
);

export const IconProgress = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M3 20h18" />
    <path d="M4 15l5-5 4 3 7-7" />
  </svg>
);

export const IconLock = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="5" y="11" width="14" height="10" rx="1.5" fill="currentColor" stroke="none" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export const IconCheck = ({ size, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={p.strokeWidth ?? 3}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const IconGift = ({ size, ...p }: P) => (
  <svg {...base(size, p)} stroke="none" fill="currentColor">
    <rect x="3.5" y="9" width="17" height="4" />
    <rect x="5" y="13" width="14" height="8" />
    <rect x="11" y="9" width="2" height="12" fill="var(--gift-ribbon, #FC3D21)" />
    <path d="M12 9c-1-3-5-4.5-6-2.5S9 9 12 9zM12 9c1-3 5-4.5 6-2.5S15 9 12 9z" />
  </svg>
);

export const IconInfo = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 11v6" />
    <circle cx="12" cy="7.5" r="0.6" fill="currentColor" />
  </svg>
);

export const IconClose = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconBack = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const IconChevron = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const IconBluetooth = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M7 7l10 10-5 4V3l5 4L7 17" />
  </svg>
);

export const IconPlay = ({ size, ...p }: P) => (
  <svg {...base(size, p)} stroke="none" fill="currentColor">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
  </svg>
);

export const IconFilm = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4" />
  </svg>
);

export const IconUser = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5" />
  </svg>
);

export const IconRefresh = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" />
  </svg>
);
