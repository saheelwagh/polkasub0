"use client"

import type { FC } from "react"

export const CurationNavbar: FC = () => {
  return (
    <header className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Curiversity</p>
        
      </div>

      <div className="w-full max-w-md">
        <label className="sr-only" htmlFor="skill-search">
          Search any skill
        </label>
        <input
          id="skill-search"
          type="search"
          placeholder="Search any skill"
          className="w-full rounded-full border border-input bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </header>
  )
}
