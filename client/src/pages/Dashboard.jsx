import SiteHeader from "@/components/layout/SiteHeader";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage users, worker approvals, and reported issues here.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="glass rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Pending Worker Approvals</div>
            <div className="text-2xl font-semibold">12</div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Total Employers</div>
            <div className="text-2xl font-semibold">320</div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Reported Issues</div>
            <div className="text-2xl font-semibold">3</div>
          </div>
        </div>
      </main>
    </div>
  );
}
