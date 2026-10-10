import { useEffect, useMemo, useState } from "react";
import { EventCard } from "./components/EventCard";
import { Icon } from "./components/Icon";
import { RegistrationModal } from "./components/RegistrationModal";
import { events, type FestEvent } from "./data/events";
import fantasyArtwork from "./assets/vibrance-fantasy-reference.jpg";

export type Registration = {
  id: string;
  eventId: number;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
};

const REGISTRATION_KEY = "vibrance-2026-registrations";
const THEME_KEY = "vibrance-2026-theme";
const FEST_START = new Date("2026-10-16T09:00:00");

function readRegistrations(): Registration[] {
  try {
    const saved = JSON.parse(localStorage.getItem(REGISTRATION_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function readTheme(): "light" | "dark" {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getCountdown() {
  const distance = Math.max(FEST_START.getTime() - Date.now(), 0);
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(readTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<FestEvent | null>(null);
  const [registrations, setRegistrations] =
    useState<Registration[]>(readRegistrations);
  const [myEventsEmail, setMyEventsEmail] = useState("");
  const [hasSearchedRegistrations, setHasSearchedRegistrations] = useState(false);
  const [success, setSuccess] = useState<{
    name: string;
    eventName: string;
  } | null>(null);
  const [countdown, setCountdown] = useState(getCountdown);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(REGISTRATION_KEY, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!selectedEvent && !success) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedEvent(null);
        setSuccess(null);
      }
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedEvent, success]);

  const registrationCountByEvent = useMemo(() => {
    return registrations.reduce<Record<number, number>>((counts, registration) => {
      counts[registration.eventId] = (counts[registration.eventId] || 0) + 1;
      return counts;
    }, {});
  }, [registrations]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events.filter(
      (event) =>
        (category === "All" || event.category === category) &&
        event.name.toLowerCase().includes(query),
    );
  }, [category, search]);

  const myRegistrations = useMemo(() => {
    const email = myEventsEmail.trim().toLowerCase();
    if (!hasSearchedRegistrations || !email) return [];
    return registrations.filter((registration) => registration.email === email);
  }, [hasSearchedRegistrations, myEventsEmail, registrations]);

  const categories = ["All", ...new Set(events.map((event) => event.category))];

  const seatsLeft = (event: FestEvent) =>
    Math.max(event.capacity - event.initialBooked - (registrationCountByEvent[event.id] || 0), 0);

  const handleRegistration = (details: {
    name: string;
    email: string;
    phone: string;
  }) => {
    if (!selectedEvent) return { error: "No event selected." };
    const normalizedEmail = details.email.trim().toLowerCase();

    if (
      registrations.some(
        (registration) =>
          registration.eventId === selectedEvent.id &&
          registration.email === normalizedEmail,
      )
    ) {
      return { error: "This email is already registered for this event." };
    }

    if (seatsLeft(selectedEvent) === 0) {
      return { error: "Sorry, this event has just reached capacity." };
    }

    const registration: Registration = {
      id: `${selectedEvent.id}-${normalizedEmail}-${Date.now()}`,
      eventId: selectedEvent.id,
      name: details.name.trim(),
      email: normalizedEmail,
      phone: details.phone.trim(),
      registeredAt: new Date().toISOString(),
    };

    setRegistrations((current) => [...current, registration]);
    setMyEventsEmail(normalizedEmail);
    setHasSearchedRegistrations(true);
    setSelectedEvent(null);
    setSuccess({ name: registration.name, eventName: selectedEvent.name });
    return {};
  };

  const scrollToEvents = () =>
    document.querySelector("#events")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Vibrance 2026 home">
          <span className="brand-mark">V</span>
          <span>VIBRANCE <b>2026</b></span>
        </a>

        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
          {[
            ["Home", "#home"],
            ["Events", "#events"],
            ["My Events", "#my-events"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="icon-button"
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} />
          </button>
          <button
            className="icon-button menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-cinematic-background" aria-hidden="true">
            <img src={fantasyArtwork} alt="" />
          </div>
          <div className="hero-fantasy-visuals" aria-hidden="true">
            <div className="island-crop">
              <img src={fantasyArtwork} alt="" />
            </div>
            <div className="portal-crop">
              <img src={fantasyArtwork} alt="" />
            </div>
          </div>
          <div className="hero-content">
            <p className="eyebrow"><span /> Campus Festival · 16–18 October</p>
            <h1>VIBRANCE <span>2026</span></h1>
            <p className="hero-tagline">One Campus. <strong>Infinite Possibilities.</strong></p>
            <p className="hero-copy">
              Three unforgettable days of bold ideas, live performances, fierce
              competition, and the energy that brings a campus to life.
            </p>
            <div className="hero-actions">
              <button className="button button-primary" type="button" onClick={scrollToEvents}>
                Explore Events <Icon name="arrow" />
              </button>
              <span className="hero-location"><Icon name="pin" /> Central University Campus</span>
            </div>
          </div>

          <div className="countdown-wrap">
            <p>THE ENERGY DROPS IN</p>
            <div className="countdown" role="timer" aria-label="Countdown to Vibrance 2026">
              {Object.entries(countdown).map(([label, value]) => (
                <div className="count-block" key={label}>
                  <strong>{String(value).padStart(2, "0")}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section events-section" id="events">
          <div className="section-heading">
            <div>
              <p className="section-kicker">FIND YOUR STAGE</p>
              <h2>Events worth showing up for</h2>
            </div>
            <p>Compete, create, perform, and connect across nine signature experiences.</p>
          </div>

          <div className="event-toolbar">
            <div className="search-wrap">
              <Icon name="search" />
              <label className="sr-only" htmlFor="event-search">Search events</label>
              <input
                id="event-search"
                type="search"
                placeholder="Search by event name..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="filters" aria-label="Filter events by category">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "filter active" : "filter"}
                  type="button"
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {filteredEvents.length ? (
            <div className="event-grid">
              {filteredEvents.map((event) => (
                <EventCard
                  event={event}
                  key={event.id}
                  seatsLeft={seatsLeft(event)}
                  onRegister={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span><Icon name="search" /></span>
              <h3>No events found</h3>
              <p>Try another search term or choose a different category.</p>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="section my-events-section" id="my-events">
          <div className="my-events-intro">
            <p className="section-kicker">YOUR FEST, ORGANIZED</p>
            <h2>Find my events</h2>
            <p>Enter the email used during registration to pull up your personal fest lineup.</p>
            <form
              className="lookup-form"
              onSubmit={(event) => {
                event.preventDefault();
                setHasSearchedRegistrations(true);
              }}
            >
              <label htmlFor="lookup-email">Registration email</label>
              <div>
                <input
                  id="lookup-email"
                  type="email"
                  required
                  placeholder="student@college.edu"
                  value={myEventsEmail}
                  onChange={(event) => {
                    setMyEventsEmail(event.target.value);
                    setHasSearchedRegistrations(false);
                  }}
                />
                <button className="button button-primary" type="submit">Find events</button>
              </div>
            </form>
          </div>

          <div className="registration-results" aria-live="polite">
            {!hasSearchedRegistrations ? (
              <div className="results-placeholder">
                <Icon name="ticket" />
                <h3>Your passes live here</h3>
                <p>Search with your email to see confirmed registrations.</p>
              </div>
            ) : myRegistrations.length ? (
              <>
                <div className="results-header">
                  <span>{myRegistrations.length} confirmed</span>
                  <strong>Your VIBRANCE lineup</strong>
                </div>
                {myRegistrations.map((registration) => {
                  const event = events.find((item) => item.id === registration.eventId);
                  if (!event) return null;
                  return (
                    <article className="registration-item" key={registration.id}>
                      <div className="registration-date">
                        <strong>{event.day}</strong><span>OCT</span>
                      </div>
                      <div>
                        <p>{event.category}</p>
                        <h3>{event.name}</h3>
                        <span>{event.time} · {event.venue}</span>
                      </div>
                      <span className="confirmed-badge"><Icon name="check" /> Confirmed</span>
                    </article>
                  );
                })}
              </>
            ) : (
              <div className="results-placeholder">
                <Icon name="ticket" />
                <h3>No registrations yet</h3>
                <p>We couldn’t find any events for that email. Browse events and claim your spot.</p>
                <button className="text-button" type="button" onClick={scrollToEvents}>
                  Browse events <Icon name="arrow" />
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="cta-strip">
          <div>
            <p className="section-kicker">MAKE IT YOURS</p>
            <h2>Ready to feel the VIBRANCE?</h2>
          </div>
          <button className="button button-light" type="button" onClick={scrollToEvents}>
            Build your lineup <Icon name="arrow" />
          </button>
        </section>
      </main>

      <footer id="contact">
        <div className="footer-main">
          <div>
            <a className="brand footer-brand" href="#home"><span className="brand-mark">V</span> VIBRANCE <b>2026</b></a>
            <p>One Campus. Infinite Possibilities.<br />Made by students, for students.</p>
          </div>
          <div>
            <h3>Festival office</h3>
            <a href="mailto:hello@vibrancefest.edu">hello@vibrancefest.edu</a>
            <p>Student Activity Centre<br />Central University Campus</p>
          </div>
          <div>
            <h3>Organized by</h3>
            <p>Student Cultural Council<br />with the Innovation & Arts Committee</p>
          </div>
          <div>
            <h3>Follow the energy</h3>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Icon name="instagram" /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><Icon name="youtube" /></a>
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X"><Icon name="x" /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 VIBRANCE. All energy reserved.</span>
          <span>16–18 October 2026</span>
        </div>
      </footer>

      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          seatsLeft={seatsLeft(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
          onSubmit={handleRegistration}
        />
      )}

      {success && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSuccess(null)}>
          <div
            className="success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="success-icon"><Icon name="check" /></div>
            <p className="section-kicker">YOU’RE ON THE LIST</p>
            <h2 id="success-title">Spot secured, {success.name.split(" ")[0]}!</h2>
            <p>Your registration for <strong>{success.eventName}</strong> is confirmed. We’ll see you at VIBRANCE.</p>
            <button className="button button-primary" type="button" onClick={() => setSuccess(null)}>
              Continue exploring
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
