import { Metadata } from "next";
import Link from "next/link";
import { login } from "../actions";

export const metadata: Metadata = { title: "Admin Login · Waxora" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-6 py-20">
      <div className="w-full max-w-[400px]">
        <div className="text-center">
          <Link href="/" className="text-2xl font-semibold text-primary">
            Waxora
          </Link>
          <h1 className="mt-6 font-semibold text-2xl text-on-background">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm text-on-surface-muted">
            Enter your credentials to access the admin dashboard.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <form action={login} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            Email
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="admin@waxora.com"
              className="rounded-md border border-outline-strong bg-surface-elevated px-3.5 py-2.5 text-on-background outline-none transition-colors focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            Password
            <input
              required
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="rounded-md border border-outline-strong bg-surface-elevated px-3.5 py-2.5 text-on-background outline-none transition-colors focus:border-primary"
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-on-primary transition-transform duration-150 hover:scale-[1.03]"
          >
            Sign in
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-on-surface-muted">
          Forgot your password? Contact the studio owner.
        </p>
      </div>
    </div>
  );
}
