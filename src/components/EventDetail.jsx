'use client';

import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Lock,
  Link2,
  Code2,
} from "lucide-react";

const EVENT_TYPE_STYLES = {
  workshop: {
    label: "Workshop",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  activity: {
    label: "Activity",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  tech_talk: {
    label: "Tech Talk",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
};

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getDuration(start, end) {
  const mins = Math.round((end - start) / 60000);
  if (mins < 60) return `${mins} minutes`;
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  return remaining > 0
    ? `${hours}h ${remaining}min`
    : `${hours} hour${hours > 1 ? "s" : ""}`;
}

/**
 * EventDetail - full-page view for a single event with
 * description, speakers, links, and related events.
 */
export default function EventDetail({
  eventId,
  allEvents,
  isLoggedIn,
  onBack,
  onSelectEvent,
}) {
  const event = allEvents.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <p className="text-muted-foreground">Event not found.</p>
        <button
          onClick={onBack}
          className="mt-4 flex items-center gap-2 text-primary transition-colors hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </button>
      </div>
    );
  }

  const style = EVENT_TYPE_STYLES[event.event_type] || EVENT_TYPE_STYLES.activity;
  const isPrivate = event.permission === "private";

  const relatedEvents = event.related_events
    .map((id) => allEvents.find((e) => e.id === id))
    .filter(Boolean)
    .filter((e) => isLoggedIn || e.permission !== "private");

  const eventUrl = isLoggedIn ? event.private_url : event.public_url;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 md:px-6"
          style = {{
            background: 'linear-gradient(to right, hsl(340, 80%, 95%), hsl(340, 80%, 90%), hsl(340, 80%, 85%))'
          }}>
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            style = {{boxShadow: '5px 6px 1px rgba(0,0,0,0.1'}}
            aria-label="Go back to all events"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Events</span>
          </button>
          <div className="flex items-center gap-2">
             <img src = "tech_talk.png" className="h-12 w-12" alt = "Logo"/>
            <span className="text-sm font-bold text-foreground">
             Hackathon Global 2026
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <article>
          {/* Badges */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${style.bg} ${style.text} ${style.border}`}
            >
              {style.label}
            </span>
            {isPrivate && (
              <span className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" aria-hidden="true" />
                Private Event
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            {event.name}
          </h1>

          {/* Date & time card */}
          <div className="mb-6 rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(event.start_time)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium text-foreground">
                    {getDuration(event.start_time, event.end_time)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">About</h2>
              <p className="leading-relaxed text-muted-foreground">
                {event.description}
              </p>
            </div>
          )}

          {/* Speakers */}
          {event.speakers.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                Speakers
              </h2>
              <div className="flex flex-wrap gap-3">
                {event.speakers.map((speaker, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {speaker.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event link */}
          {eventUrl && (
            <div className="mb-8">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                Event Link
              </h2>
              <a
                href={eventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                {isLoggedIn ? "Open Private Link" : "Open Public Link"}
              </a>
            </div>
          )}

          {/* Related events */}
          {relatedEvents.length > 0 && (
            <section aria-label="Related events">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Link2 className="h-5 w-5 text-primary" aria-hidden="true" />
                Related Events
              </h2>
              <div className="flex flex-col gap-3">
                {relatedEvents.map((relEvent) => {
                  const relStyle =
                    EVENT_TYPE_STYLES[relEvent.event_type] ||
                    EVENT_TYPE_STYLES.activity;

                  return (
                    <button
                      key={relEvent.id}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        onSelectEvent(relEvent.id);
                      }}
                      className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 text-left transition-transform duration-200 ease-out hover:-translate-y-0.4 hover:shadow-md"
                      aria-label={`View related event: ${relEvent.name}`}
                    >
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${relStyle.bg} ${relStyle.text} ${relStyle.border}`}
                          >
                            {relStyle.label}
                          </span>
                          {relEvent.permission === "private" && (
                            <Lock
                              className="h-3 w-3 text-muted-foreground"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                          {relEvent.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatDate(relEvent.start_time)} at{" "}
                          {formatTime(relEvent.start_time)}
                        </p>
                      </div>
                      <ArrowLeft
                        className="h-4 w-4 rotate-180 text-muted-foreground transition-colors group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </article>
      </main>

      <footer className="border-t border-border py-6">
        <p className="text-center text-xs text-muted-foreground">
          Built for Hack the North 2026 Frontend Challenge
        </p>
      </footer>
    </div>
  );
}
