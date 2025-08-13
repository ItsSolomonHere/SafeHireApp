import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--pointer-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--pointer-y", `${e.clientY - rect.top}px`);
    };
    el?.addEventListener("mousemove", onMove);
    return () => el?.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <section ref={ref} className="relative overflow-hidden app-gradient">
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center animate-enter">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Hire Trusted Blue-Collar Professionals in Kenya
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            SafeHire connects employers with verified fundis, domestic workers, drivers, and more — fast, safe, and reliable.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild size="lg" variant="hero" className="hover-scale">
              <Link to="/workers">Browse Workers <ArrowRight className="ml-1" /></Link>
            </Button>
            <Button asChild size="lg" variant="glass" className="hover-scale">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Admin approval required for worker profiles. Background checks available on request.
          </p>
        </div>
      </div>
    </section>
  );
}
