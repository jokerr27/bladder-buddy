import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";
import { BladderEvent } from "@/pages/Index";
import { format, eachDayOfInterval, isSameDay, subDays, startOfWeek, endOfWeek } from "date-fns";

interface LeakHeatmapProps {
  events: BladderEvent[];
  onDateClick?: (date: Date) => void;
}

export function LeakHeatmap({ events, onDateClick }: LeakHeatmapProps) {
  // Filter to only leak events from the past 30 days
  const thirtyDaysAgo = subDays(new Date(), 30);
  const leakEvents = events.filter(
    (e) => e.type === "leak" && new Date(e.timestamp) >= thirtyDaysAgo
  );

  // Get all days in the past 30 days
  const today = new Date();
  const startDate = subDays(today, 29); // 29 days ago + today = 30 days
  const days = eachDayOfInterval({
    start: startDate,
    end: today,
  });

  // Count leaks per day
  const leaksByDay = new Map<string, number>();
  leakEvents.forEach((event) => {
    const dayKey = format(new Date(event.timestamp), "yyyy-MM-dd");
    leaksByDay.set(dayKey, (leaksByDay.get(dayKey) || 0) + 1);
  });

  // Get max leaks for color intensity
  const maxLeaks = Math.max(...Array.from(leaksByDay.values()), 1);

  // Get color intensity based on leak count
  const getColorIntensity = (count: number): string => {
    if (count === 0) return "bg-muted/30";
    const intensity = Math.min(count / maxLeaks, 1);
    if (intensity <= 0.25) return "bg-destructive/30";
    if (intensity <= 0.5) return "bg-destructive/50";
    if (intensity <= 0.75) return "bg-destructive/70";
    return "bg-destructive";
  };

  // Group days by week for display (Sunday to Saturday)
  const weeks: Date[][] = [];
  const startOfFirstWeek = startOfWeek(startDate, { weekStartsOn: 0 }); // Sunday
  const endOfLastWeek = endOfWeek(today, { weekStartsOn: 0 }); // Sunday
  
  const allDaysInRange = eachDayOfInterval({
    start: startOfFirstWeek,
    end: endOfLastWeek,
  });

  // Group into weeks
  for (let i = 0; i < allDaysInRange.length; i += 7) {
    weeks.push(allDaysInRange.slice(i, i + 7));
  }

  // Get day labels
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const totalLeaks = leakEvents.length;

  return (
    <Card className="shadow-card border-0">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h2 className="text-lg font-semibold text-foreground">Leak Heatmap</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            {totalLeaks} leak{totalLeaks !== 1 ? "s" : ""} in past 30 days
          </div>
        </div>

        <div className="space-y-2">
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground mb-2">
            {dayLabels.map((label) => (
              <div key={label} className="text-center font-medium">
                {label}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <TooltipProvider>
            <div className="grid grid-cols-7 gap-1">
              {weeks.map((week, weekIndex) =>
                week.map((day, dayIndex) => {
                  const dayKey = format(day, "yyyy-MM-dd");
                  const leakCount = leaksByDay.get(dayKey) || 0;
                  const isToday = isSameDay(day, today);
                  const isInRange = day >= startDate && day <= today;

                  const handleClick = () => {
                    if (isInRange && onDateClick) {
                      onDateClick(day);
                    }
                  };

                  return (
                    <Tooltip key={`${weekIndex}-${dayIndex}`}>
                      <TooltipTrigger asChild>
                        <div
                          onClick={handleClick}
                          className={`
                            aspect-square rounded-sm transition-all cursor-pointer
                            ${!isInRange ? "bg-muted/10 opacity-30 cursor-not-allowed" : getColorIntensity(leakCount)}
                            ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}
                            ${isInRange && onDateClick ? "hover:scale-110 hover:z-10 hover:ring-2 hover:ring-accent" : ""}
                            relative
                          `}
                          style={{ minWidth: "32px", minHeight: "32px" }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <p className="font-semibold">{format(day, "MMM d, yyyy")}</p>
                          <p className="text-sm text-muted-foreground">
                            {leakCount === 0
                              ? "No leaks"
                              : `${leakCount} leak${leakCount !== 1 ? "s" : ""}`}
                          </p>
                          {isInRange && onDateClick && (
                            <p className="text-xs text-muted-foreground mt-1">Click to log event</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })
              )}
            </div>
          </TooltipProvider>

          {/* Legend */}
          <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted/30" />
              <div className="w-3 h-3 rounded-sm bg-destructive/30" />
              <div className="w-3 h-3 rounded-sm bg-destructive/50" />
              <div className="w-3 h-3 rounded-sm bg-destructive/70" />
              <div className="w-3 h-3 rounded-sm bg-destructive" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

