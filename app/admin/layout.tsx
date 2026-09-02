import Link from "next/link";
import { logout } from "./actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-background">
      <div className="border-b border-outline bg-surface-elevated">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3 md:px-10">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-lg font-semibold text-primary"
            >
              Waxora
            </Link>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-on-surface-muted transition-colors hover:text-primary"
            >
              View site
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-outline-strong px-4 py-2 text-sm font-medium text-on-background transition-colors hover:border-primary hover:text-primary"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
