"use client";

import Timeline from "@/components/ui/timeline";

const settings = {
  textColor: "var(--color-foreground, #0f172a)",
  mutedTextColor: "var(--color-muted-foreground, #64748b)",
  activeColor: "#2563eb",
  backgroundColor: "var(--color-background, #f8f9fa)",
  duration: 1.4,
};

export default function TimelineDemo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <main className="bg-background text-foreground">
      {/* Lead-in */}
      <section className="flex h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Journey & Milestones
        </p>
        <h1 className="max-w-[18ch] text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Learning, designing. Learning, designing.
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          From university projects to professional product work, every experience
          has shaped the way I think, design and build.
        </p>
        <span className="mt-2 animate-bounce text-muted-foreground">&darr;</span>
      </section>

      {/* Realistic usage */}
      <Timeline
        title="Experience Storyline"
        periodLabel="2024 — Present"
        backgroundColor={s.backgroundColor}
        textColor={s.textColor}
        mutedTextColor={s.mutedTextColor}
        activeColor={s.activeColor}
        imageUrl="assets/dinitha-work-photo.jpeg"
        imageAlt="Dinitha Navanith at work"
        duration={s.duration}
      />

      <section className="flex h-screen items-center justify-center px-6 text-center text-sm text-muted-foreground">
        From university hackathons to professional UI/UX & development at Treeloq.
      </section>
    </main>
  );
}
