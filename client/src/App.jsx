import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Workers from "@/pages/Workers";
import WorkerProfile from "@/pages/WorkerProfile";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Bookings from "@/pages/Bookings";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "sonner";

export default function App() {
  return (
    <TooltipProvider>
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/workers" element={<Workers />} />
        <Route path="/workers/:id" element={<WorkerProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
}
