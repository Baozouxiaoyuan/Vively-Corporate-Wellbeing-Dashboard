import { Link } from "react-router-dom";
import { Button } from "../components/vively-ui/Button";
import { Card, CardContent } from "../components/vively-ui/Card";
import { Input } from "../components/vively-ui/Input";
import { VivelyLogo } from "../components/vively-ui/Logo";

export function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-mist px-4">
      <Card className="w-full max-w-md rounded-3xl py-8 shadow-soft">
        <CardContent>
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neutral-900 text-white">
            <VivelyLogo className="h-7 w-8" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Vively Corporate</h1>
            <p className="text-sm text-ink/55">Admin dashboard prototype</p>
          </div>
        </div>
        <label className="block text-sm font-medium text-ink/70" htmlFor="email">
          Email
        </label>
        <Input id="email" className="mt-2" defaultValue="ryua7873@uni.sydney.edu.au" />
        <label className="mt-4 block text-sm font-medium text-ink/70" htmlFor="password">
          Password
        </label>
        <Input id="password" type="password" className="mt-2" defaultValue="prototype" />
        <Button asChild className="mt-6 w-full">
          <Link to="/dashboard">Sign in</Link>
        </Button>
        </CardContent>
      </Card>
    </main>
  );
}
