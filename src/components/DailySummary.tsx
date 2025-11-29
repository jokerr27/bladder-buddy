import { Card } from "@/components/ui/card";
import { Droplets, AlertCircle, Coffee, TrendingUp } from "lucide-react";
import { BladderEvent } from "@/pages/Index";
import { format, isSameDay } from "date-fns";

interface DailySummaryProps {
  events: BladderEvent[];
  date: Date;
}

export function DailySummary({ events, date }: DailySummaryProps) {
  const urinations = events.filter((e) => e.type === "urination");
  const leaks = events.filter((e) => e.type === "leak");
  const fluids = events.filter((e) => e.type === "fluid");

  const totalFluidIntake = fluids.reduce((sum, e) => sum + (e.volume || 0), 0);
  const avgUrgency = urinations.length
    ? urinations.reduce((sum, e) => sum + (e.urgency || 0), 0) / urinations.length
    : 0;
  
  const avgVolume = urinations.length
    ? urinations.reduce((sum, e) => sum + (e.volume || 0), 0) / urinations.length
    : 0;
  
  const avgSeverity = leaks.length
    ? leaks.reduce((sum, e) => sum + (e.severity || 0), 0) / leaks.length
    : 0;

  const isToday = isSameDay(date, new Date());

  const stats = [
    {
      label: "Urinations",
      value: urinations.length,
      icon: Droplets,
      color: "text-primary",
    },
    {
      label: "Leak Events",
      value: leaks.length,
      icon: AlertCircle,
      color: "text-destructive",
    },
    {
      label: "Fluid Intake",
      value: `${totalFluidIntake}ml`,
      icon: Coffee,
      color: "text-accent",
    },
    {
      label: "Avg Urgency",
      value: avgUrgency > 0 ? avgUrgency.toFixed(1) : "—",
      icon: TrendingUp,
      color: "text-warning",
    },
    ...(avgVolume > 0 ? [{
      label: "Avg Volume",
      value: `${avgVolume.toFixed(0)}%`,
      icon: Droplets,
      color: "text-primary",
    }] : []),
    ...(avgSeverity > 0 ? [{
      label: "Avg Severity",
      value: avgSeverity.toFixed(1),
      icon: AlertCircle,
      color: "text-destructive",
    }] : []),
  ];

  return (
    <Card className="shadow-card border-0">
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {isToday ? "Today's Summary" : `${format(date, "MMM d")} Summary`}
        </h2>
        <div className="grid grid-cols-2 gap-4 auto-rows-fr">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-muted/50 rounded-lg p-4 space-y-2 transition-smooth hover:bg-muted/70"
              >
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
