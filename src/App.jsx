'use client';

import { useState, useMemo } from "react";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import EventCard from "./components/EventCard";
import FilterBar from "./components/FilterBar";
import EventDetail from "./components/EventDetail";
import { Loader2, AlertCircle, Lock } from "lucide-react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());
const EVENTS_API = "https://api.hackthenorth.com/v3/events";

export default function App() {
  const { isLoggedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSort, setActiveSort] = useState("earliest");
  const [selectedEventId, setSelectedEventId] = useState(null);

  const { data: events, error, isLoading } = useSWR(EVENTS_API, fetcher);

  
   // Count how many private events are hidden if the user is logged out
   
  const hiddenCount = useMemo(() => {
    if (!events || isLoggedIn) return 0;
    return events.filter((e) => e.permission === "private").length;
  }, [events, isLoggedIn]);

  
  // Filter and sort events based on login state, type filter, search
  // The original sort order is from the first occuring event to the last occuring event based on
  // the time fetched in the API 
  
  const filteredEvents = useMemo(() => {
    if (!events) return [];

    let result = [...events];

    // Sort by start_time
    if (activeSort === "earliest") {
      result.sort((a, b) => a.start_time - b.start_time);
    } else {
      result.sort((a, b) => b.start_time - a.start_time);
    }

    // Permission filter -> this filters so hackers not logged in cannot see private events
    if (!isLoggedIn) {
      result = result.filter((event) => event.permission !== "private");
    }

    if (activeFilter !== "all") {
      result = result.filter((event) => event.event_type === activeFilter);
    }

    // Search filter for the search bar
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((event) => {
        const nameMatch = event.name.toLowerCase().includes(query);
        const descMatch = event.description?.toLowerCase().includes(query);
        const speakerMatch = event.speakers.some((s) =>
          s.name.toLowerCase().includes(query)
        );
        return nameMatch || descMatch || speakerMatch;
      });
    }

    return result;
  }, [events, isLoggedIn, activeFilter, activeSort, searchQuery]);

  
   // Event counts for filter dropdown badges
  
  const eventCounts = useMemo(() => {
    if (!events) return { all: 0, workshop: 0, activity: 0, tech_talk: 0 };

    const visible = isLoggedIn
      ? events
      : events.filter((e) => e.permission !== "private");

    return {
      all: visible.length,
      workshop: visible.filter((e) => e.event_type === "workshop").length,
      activity: visible.filter((e) => e.event_type === "activity").length,
      tech_talk: visible.filter((e) => e.event_type === "tech_talk").length,
    };
  }, [events, isLoggedIn]);

  // Event detailed view
  if (selectedEventId && events) {
    return (
      <EventDetail
        eventId={selectedEventId}
        allEvents={events}
        isLoggedIn={isLoggedIn}
        onBack={() => setSelectedEventId(null)}
        onSelectEvent={(id) => setSelectedEventId(id)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {/* Heading */}
        <section className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            <img src = "chiikawa.png" className="h-12 w-20"/>Event Schedule
          </h1>
          <p className="mt-1 text-muted-foreground">
            January 12-15, 2026 | Browse events
          </p>
        </section>

        {/* Search + Filter */}
        <section className="mb-6" aria-label="Event filters">
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            activeSort={activeSort}
            onSortChange={setActiveSort}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            eventCounts={eventCounts}
          />
        </section>

        {/* Hidden events banner */}
        {!isLoggedIn && hiddenCount > 0 && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border-2 border-dashed border-border bg-card p-4">
            <Lock className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {hiddenCount} hacker-only event{hiddenCount !== 1 ? "s are" : " is"}{" "}
                hidden
              </p>
              <p className="text-sm text-muted-foreground">
                Log in as a hacker to see exclusive workshops, talks, and activities
              </p>
            </div>
          </div>
        )}

        {/* Loading screen */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20" role="status">
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
            <p className="mt-4 text-sm text-muted-foreground">Loading events...</p>
            <span className="sr-only">Loading events</span>
          </div>
        )}

        {/* Error screen */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20" role="alert">
            <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
            <p className="mt-4 text-sm text-muted-foreground">
              Failed to load events. Please try again later.
            </p>
          </div>
        )}

        {/* List of events (one per row) */}
        {!isLoading && !error && (
          <section aria-label="Events list">
            {filteredEvents.length > 0 && (
              <p className="mb-4 text-sm text-muted-foreground">
                Showing {filteredEvents.length} events
              </p>
            )}

            {filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-muted-foreground">
                  No events found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isLoggedIn={isLoggedIn}
                    onClick={() => setSelectedEventId(event.id)}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="border-t border-border py-6">
        <p className="text-center text-xs text-muted-foreground">
          Design Challenge - Hack The North 2026 - Amy Huang
        </p>
      </footer>
    </div>
  );
}
