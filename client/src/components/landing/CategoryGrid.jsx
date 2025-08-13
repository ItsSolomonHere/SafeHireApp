import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Home, Bike, Leaf, Paintbrush, Users, Shield, BookOpen, Package, Car } from "lucide-react";

const categories = [
  { name: "Fundis", icon: Wrench },
  { name: "Domestic Workers", icon: Home },
  { name: "Boda Boda Riders", icon: Bike },
  { name: "Gardeners", icon: Leaf },
  { name: "Painters", icon: Paintbrush },
  { name: "Event Crew", icon: Users },
  { name: "Security Guards", icon: Shield },
  { name: "Tutors", icon: BookOpen },
  { name: "Delivery Personnel", icon: Package },
  { name: "Drivers", icon: Car },
];

export default function CategoryGrid() {
  return (
    <section>
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold">Browse Categories</h2>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {categories.map(({ name, icon: Icon }) => (
            <Card key={name} className="glass hover-scale">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Icon className="mb-2 h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-center">{name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
