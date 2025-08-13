import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function SiteHeader() {
  const navCls = ({ isActive }) => isActive ? "font-medium text-primary" : "text-foreground/80 hover:text-foreground";
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-primary shadow-glow" />
          <span className="text-lg font-bold tracking-tight text-gradient-primary">SafeHire Kenya</span>
        </Link>
        <nav className="hidden gap-4 md:flex">
          <NavLink to="/workers" className={navCls}>Find Workers</NavLink>
          <NavLink to="/bookings" className={navCls}>Bookings</NavLink>
          <NavLink to="/dashboard" className={navCls}>Dashboard</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/login">Log in</Link></Button>
          <Button asChild variant="hero" size="sm"><Link to="/signup">Sign up</Link></Button>
        </div>
      </div>
    </header>
  );
}
