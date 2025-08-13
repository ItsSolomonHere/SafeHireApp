import SiteHeader from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";

export default function Bookings() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="mt-2 text-muted-foreground">Schedule, track, and manage your bookings. M-Pesa payment simulation placeholder included.</p>
        <div className="mt-6 glass rounded-lg p-6">
          <div className="text-sm text-muted-foreground">No bookings yet.</div>
          <Button className="mt-3" variant="hero">Create Booking</Button>
        </div>
      </main>
    </div>
  );
}
