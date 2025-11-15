"use client"

import { useEffect, useState } from "react"

const HERO_WORDS = ["Curate", "Learn", "Request"] as const

export default function LandingPage() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_WORDS.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const activeWord = HERO_WORDS[activeIndex]

  return (
    <main className="min-h-screen w-full px-6 py-10">
      {/* Navbar with search */}
      <header className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Curation platform</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Curation platform for the world
          </h1>
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

      {/* Hero section */}
      <section className="mx-auto mt-16 max-w-4xl text-center">
        <p className="text-3xl font-semibold leading-tight sm:text-4xl">
          <span className="inline-flex flex-col items-center justify-center sm:inline-block">
            <span className="relative mb-2 inline-block min-w-[7rem] text-primary">
              {activeWord}
            </span>
          </span>{" "}
          any skill.
        </p>
        <p className="mt-4 text-base text-muted-foreground">
          Curate niche knowledge, learn hyperspecific skills, or request exactly what you want to study
          all in one place.
        </p>
      </section>

      {/* Curate / Learn / Request cards */}
      <section className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
        {/* Curate */}
        <div className="flex flex-col rounded-2xl bg-primary p-6 text-left text-primary-foreground shadow-md">
          <h2 className="text-lg font-semibold">Curate</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Combine knowledge into a specific skill and publish it as a curated path others can follow.
          </p>
        </div>

        {/* Learn */}
        <div className="flex flex-col rounded-2xl bg-card p-6 text-left text-primary shadow-md border border-border">
          <h2 className="text-lg font-semibold">Learn</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Learn a hyperspecific skill curated just for you, with focused paths instead of endless courses.
          </p>
        </div>

        {/* Request */}
        <div className="flex flex-col rounded-2xl bg-primary p-6 text-left text-primary-foreground shadow-md">
          <h2 className="text-lg font-semibold">Request</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Request a skill you want to learn and let curators assemble the best resources on the web.
          </p>
        </div>
      </section>
    </main>
  )
}
