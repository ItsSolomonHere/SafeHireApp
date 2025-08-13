import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function WorkerCard({ worker }) {
  return (
    <Card className="glass hover-scale">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-primary" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{worker.name}</h3>
              <div className="flex items-center gap-1 text-primary">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm text-muted-foreground">{worker.rating.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{worker.role} • {worker.location}</p>
            <p className="mt-1 text-sm">{worker.rate} • {worker.availability ?? "Available"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
