import { useParams } from "react-router-dom";
import SiteHeader from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";

export default function WorkerProfile() {
  const { id } = useParams();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <div className="h-40 w-40 rounded-full bg-gradient-primary shadow-glow" />
            <h1 className="text-3xl font-bold">Worker #{id}</h1>
            <p className="text-muted-foreground">Bio and skills will appear here. Admin-approved, verified profiles ensure safety and quality.</p>
          </div>
          <aside className="space-y-3">
            <div className="glass rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Hourly Rate</div>
              <div className="text-xl font-semibold">KES 800/hr</div>
              <Button className="mt-3 w-full" variant="hero">Book Now</Button>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-sm font-medium">Availability</div>
              <div>Mon - Sat</div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
