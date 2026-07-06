import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-mist px-4">
      <section className="w-full max-w-md rounded-lg border border-ink/10 bg-white p-8 shadow-soft">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-teal text-white">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Vively Corporate</h1>
            <p className="text-sm text-ink/55">Admin dashboard prototype</p>
          </div>
        </div>
        <label className="block text-sm font-medium text-ink/70" htmlFor="email">
          Email
        </label>
        <input id="email" className="mt-2 w-full rounded-md border border-ink/10 px-3 py-2 outline-none focus:border-teal" defaultValue="mia.chen@northstar.example" />
        <label className="mt-4 block text-sm font-medium text-ink/70" htmlFor="password">
          Password
        </label>
        <input id="password" type="password" className="mt-2 w-full rounded-md border border-ink/10 px-3 py-2 outline-none focus:border-teal" defaultValue="prototype" />
        <Link to="/dashboard" className="mt-6 flex w-full items-center justify-center rounded-md bg-teal px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal/90">
          Sign in
        </Link>
      </section>
    </main>
  );
}
