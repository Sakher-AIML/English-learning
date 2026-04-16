import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-primary">Step 1 of 5</p>
        <h1 className="text-3xl font-extrabold">Let&apos;s place your level</h1>
      </header>

      <div className="rounded-2xl border bg-surface-2 p-4 text-sm text-text-2">
        Onboarding flow scaffolding is ready. Next step is wiring multi-step state, assessment
        scoring, and Supabase persistence.
      </div>

      <Button className="w-full">Start assessment</Button>
    </section>
  );
}
