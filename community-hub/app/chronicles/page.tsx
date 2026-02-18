"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFaction } from "@/context/FactionContext";

interface ChroniclePost {
  id: string;
  title: string;
  subtitle: string | null;
  author: string;
  created_at: string | null;
}

const PLACEHOLDER_POST: ChroniclePost = {
  id: "placeholder",
  title: "No Chronicles Yet!",
  subtitle: "They're on their way, I swear",
  author: "Atlas",
  created_at: null,
};

export default function ChroniclesPage() {
  const { faction } = useFaction();
  const [posts, setPosts] = useState<ChroniclePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chronicles")
      .then((res) => res.json())
      .then((data: ChroniclePost[]) => {
        setPosts(data.length > 0 ? data : [PLACEHOLDER_POST]);
      })
      .catch(() => {
        setPosts([PLACEHOLDER_POST]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="pb-20">
      <div className="flex justify-start px-4 pt-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/50 px-4 py-2 text-sm font-medium text-muted transition-all hover:border-accent-primary/30 hover:text-foreground hover:bg-surface-hover"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Return to Dashboard
        </Link>
      </div>

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            The Chronicles
          </h1>
          <p className="mt-2 text-sm text-muted">
            Stories, newsletters, and dispatches from across the island.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-accent-primary" />
            </div>
          ) : (
            posts.map((post, index) => (
              <div
                key={post.id}
                className="glass-card group relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:scale-[1.005] hover:-translate-y-0.5"
              >
                <div className="absolute inset-x-0 top-0 h-px rounded-full bg-accent-primary opacity-30 transition-opacity group-hover:opacity-80" />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-primary/10 text-lg font-bold text-accent-primary/70">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold leading-tight">
                        {post.title}
                      </h2>
                      {post.subtitle && (
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          {post.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 border-t border-border/30 pt-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-primary/70">
                    By {post.author}
                  </span>
                  {post.created_at && (
                    <>
                      <span className="text-muted/30">|</span>
                      <span className="text-[10px] font-medium text-muted/60">
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <footer className="mt-12 border-t border-border py-8 px-4 text-center">
        <p className="text-xs text-muted">
          {faction.name} &mdash; {faction.tagline}
        </p>
      </footer>
    </div>
  );
}
