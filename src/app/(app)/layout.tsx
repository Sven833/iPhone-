import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-slate-900">
              MSB Malerbetrieb
            </span>
            <nav className="flex gap-4 text-sm">
              <Link
                href="/dashboard"
                className="text-slate-600 hover:text-orange-600"
              >
                Dashboard
              </Link>
              <Link
                href="/kunden"
                className="text-slate-600 hover:text-orange-600"
              >
                Kunden
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>{session?.user?.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
              >
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
