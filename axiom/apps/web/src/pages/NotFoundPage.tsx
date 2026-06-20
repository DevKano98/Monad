import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <Link className="mt-4 inline-block text-signal" to="/">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
