import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-primary">Welcome back</p>
        <h1 className="text-3xl font-extrabold">Log in to LinguaAI</h1>
      </header>

      <form className="space-y-4">
        <label className="block space-y-2 text-sm font-semibold text-text-1">
          Email
          <input type="email" className="w-full rounded-xl border bg-white px-3 py-2" />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-text-1">
          Password
          <input type="password" className="w-full rounded-xl border bg-white px-3 py-2" />
        </label>

        <Button className="w-full">Continue</Button>
        <Button variant="secondary" className="w-full">
          Continue with Google
        </Button>
      </form>

      <p className="text-center text-sm text-text-2">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-primary">
          Create an account
        </Link>
      </p>
    </section>
  );
}
