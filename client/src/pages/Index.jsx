import SiteHeader from "@/components/layout/SiteHeader";
import Hero from "@/components/landing/Hero";
import CategoryGrid from "@/components/landing/CategoryGrid";

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <CategoryGrid />
      </main>
    </div>
  );
}
