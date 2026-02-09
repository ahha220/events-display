'use client';

import { Calendar, Clock, Users, Lock } from "lucide-react";

/**
 * Maps event types to colored badge styles.
 */
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
    weekday: "short",
    month: "short",
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
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  return remaining > 0 ? `${hours}h ${remaining}min` : `${hours}h`;
}

/**
 * EventCard - single-column card with type badge, date/time, speakers.
 * Subtle lift on hover.
 */
export default function EventCard({ event, isLoggedIn, onClick }) {
  const style = EVENT_TYPE_STYLES[event.event_type] || EVENT_TYPE_STYLES.activity;
  const isPrivate = event.permission === "private";

  return (
    <button
      onClick={onClick}
      className="group flex w-full flex-col rounded-xl border border-border bg-card p-5 text-left transition-transform duration-200 ease-out hover:-translate-y-0.3 hover:shadow focus:outline-none focus:ring-2 focus:ring-ring/40"
      aria-label={`View details for ${event.name}`}
    >
      {/* Type badge */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${style.bg} ${style.text} ${style.border}`}
        >
          {style.label}
        </span>
        {isPrivate && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" aria-hidden="true" />
            Private
          </span>
        )}
      </div>

      {/* Event name */}
      <h3 className="mb-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
        {event.name}
      </h3>

      {/* Description */}
      {event.description && (
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {event.description}
        </p>
      )}

      <div className="mt-auto" />

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          {formatDate(event.start_time)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {formatTime(event.start_time)}
        </span>
        <span className="rounded bg-secondary px-1.5 py-0.5 text-xs">
          {getDuration(event.start_time, event.end_time)}
        </span>
      </div>

      {/* Speakers */}
      {event.speakers.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{event.speakers.map((s) => s.name).join(", ")}</span>
        </div>
      )}
    </button>
  );
}
