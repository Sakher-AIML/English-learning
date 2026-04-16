export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
      <div className="surface-card w-full max-w-md p-6 md:p-8">{children}</div>
    </main>
  );
}