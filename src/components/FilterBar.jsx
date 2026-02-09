'use client';

// This JSX files helps with an additional component of filtering 
// the events based on event type and helps user search up events 

import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ArrowUpDown, Check } from "lucide-react";

const FILTER_OPTIONS = [
  { key: "all", label: "All Events" },
  { key: "workshop", label: "Workshops" },
  { key: "activity", label: "Activities" },
  { key: "tech_talk", label: "Tech Talks" },
];


 // FilterBar - function creates the search input bar & filter dropdown.

export default function FilterBar({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  eventCounts,
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Event Listener to determine the type of filter applied

  useEffect(() => {
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeFilterLabel =
    FILTER_OPTIONS.find((f) => f.key === activeFilter)?.label || "Filter";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search Input Feature -> Search input matches based on text in description, speaker, or event title 
      ex: putting in hi will still show a bunch of events (because the text is included)*/}
      <div className="relative flex-1">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeWidth="2" />
        </svg>
        <input
          type="search"
          placeholder="Search events, speakers, locations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          aria-label="Search events"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Filter dropdown -> Gives options of all events, workshops, activities, and tech talks, + shows how many of each*/}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => {
              setFilterOpen(!filterOpen);
            }}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            aria-haspopup="listbox"
            aria-expanded={filterOpen}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span>{activeFilter === "all" ? "Filter" : activeFilterLabel}</span>
          </button>
          {filterOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-border bg-card py-1 shadow-lg">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  onClick={() => {
                    onFilterChange(option.key);
                    setFilterOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  <span>
                    {option.label}
                    {eventCounts?.[option.key] != null && (
                      <span className="ml-2 text-muted-foreground">
                        ({eventCounts[option.key]})
                      </span>
                    )}
                  </span>
                  {activeFilter === option.key && (
                    <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
