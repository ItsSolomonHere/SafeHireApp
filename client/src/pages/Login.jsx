import SiteHeader from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-md glass rounded-lg p-6">
          <h1 className="text-2xl font-bold">Log in</h1>
          <form className="mt-5 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button type="submit" variant="hero" className="w-full">Continue</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
