type IconName =
  | "arrow" | "book" | "calendar" | "camera" | "check" | "close" | "code"
  | "game" | "instagram" | "menu" | "mic" | "moon" | "music" | "pin"
  | "robot" | "search" | "sport" | "sun" | "ticket" | "users" | "x" | "youtube";

export function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z" /><path d="M8 7h8M8 11h6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    camera: <><path d="M14.5 5 13 3h-2L9.5 5H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4.5Z" /><circle cx="12" cy="12.5" r="4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="M18 6 6 18M6 6l12 12" />,
    code: <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />,
    game: <><path d="M8.5 8h7a5.5 5.5 0 0 1 5.2 7.3l-.6 1.7a2.5 2.5 0 0 1-4.2.9L14 16h-4l-1.9 1.9a2.5 2.5 0 0 1-4.2-.9l-.6-1.7A5.5 5.5 0 0 1 8.5 8Z" /><path d="M7 11v4M5 13h4M16.5 12h.01M18.5 14h.01" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" /></>,
    moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />,
    music: <><path d="M9 18V5l10-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    robot: <><rect x="4" y="7" width="16" height="13" rx="3" /><path d="M12 3v4M8 12h.01M16 12h.01M8 16h8" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    sport: <><circle cx="12" cy="12" r="9" /><path d="m8 4 4 3 4-3M5 15l4-1 3 4 3-4 4 1M12 7v5" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" /></>,
    ticket: <><path d="M3 8a2 2 0 0 0 0 4v5h18v-5a2 2 0 0 0 0-4V3H3v5Z" /><path d="M13 5v2M13 10v2M13 15v2" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    x: <path d="M5 4l14 16M19 4 5 20" />,
    youtube: <><path d="M21.5 7.2a2.7 2.7 0 0 0-1.9-1.9C17.9 5 12 5 12 5s-5.9 0-7.6.3a2.7 2.7 0 0 0-1.9 1.9A28 28 0 0 0 2.2 12a28 28 0 0 0 .3 4.8 2.7 2.7 0 0 0 1.9 1.9C6.1 19 12 19 12 19s5.9 0 7.6-.3a2.7 2.7 0 0 0 1.9-1.9 28 28 0 0 0 .3-4.8 28 28 0 0 0-.3-4.8Z" /><path d="m10 15 5-3-5-3v6Z" /></>,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}
