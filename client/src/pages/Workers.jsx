import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import WorkerCard from "@/components/workers/WorkerCard";
import SiteHeader from "@/components/layout/SiteHeader";

const mockWorkers = [
  { id: "1", name: "John Mwangi", role: "Electrician", location: "Nairobi", rate: "KES 800/hr", rating: 4.7, availability: "Available" },
  { id: "2", name: "Aisha Njeri", role: "Nanny", location: "Mombasa", rate: "KES 600/hr", rating: 4.8, availability: "Weekdays" },
  { id: "3", name: "Peter Otieno", role: "Plumber", location: "Kisumu", rate: "KES 900/hr", rating: 4.5, availability: "On Call" },
];

export default function Workers() {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("any");
  const [role, setRole] = useState("any");
  const [gender, setGender] = useState("any");

  const results = useMemo(() => {
    return mockWorkers.filter((w) =>
      [w.name, w.role, w.location].join(" ").toLowerCase().includes(q.toLowerCase()) &&
      ((location === "any") || w.location === location) &&
      ((role === "any") || w.role.toLowerCase().includes(role.toLowerCase())) &&
      (gender === "any")
    );
  }, [q, location, role, gender]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Find Workers</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3">
          <Input placeholder="Search name, skill, location" value={q} onChange={(e) => setQ(e.target.value)} className="md:col-span-2" />
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="Nairobi">Nairobi</SelectItem>
              <SelectItem value="Mombasa">Mombasa</SelectItem>
              <SelectItem value="Kisumu">Kisumu</SelectItem>
            </SelectContent>
          </Select>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger><SelectValue placeholder="Skill" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="Electrician">Electrician</SelectItem>
              <SelectItem value="Plumber">Plumber</SelectItem>
              <SelectItem value="Nanny">Nanny</SelectItem>
            </SelectContent>
          </Select>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full" variant="glass">Filters</Button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {results.map((w) => (
            <WorkerCard key={w.id} worker={w} />
          ))}
        </div>
      </main>
    </div>
  );
}
