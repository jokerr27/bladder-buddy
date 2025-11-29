import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, AlertCircle, Coffee, Edit2, Trash2 } from "lucide-react";
import { BladderEvent } from "@/pages/Index";
import { format, isSameDay } from "date-fns";

interface TimelineProps {
  events: BladderEvent[];
  date: Date;
  onEdit?: (event: BladderEvent) => void;
  onDelete?: (eventId: string) => void;
}

export function Timeline({ events, date, onEdit, onDelete }: TimelineProps) {
  const isToday = isSameDay(date, new Date());
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (events.length === 0) {
    return (
      <Card className="shadow-card border-0">
        <div className="p-12 text-center">
          <Droplets className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">
            No events {isToday ? "yet today" : `on ${format(date, "MMM d, yyyy")}`}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isToday 
              ? "Tap the buttons above to start tracking your bladder health."
              : "No events were logged for this day."}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-0">
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {isToday ? "Today's Timeline" : `${format(date, "MMM d")} Timeline`}
        </h2>
        <div className="space-y-3">
          {sortedEvents.map((event) => {
            let Icon = Droplets;
            let bgColor = "bg-primary/10";
            let iconColor = "text-primary";
            let label = "Urination";

            if (event.type === "leak") {
              Icon = AlertCircle;
              bgColor = "bg-destructive/10";
              iconColor = "text-destructive";
              label = "Leak Event";
            } else if (event.type === "fluid") {
              Icon = Coffee;
              bgColor = "bg-accent/10";
              iconColor = "text-accent";
              label = event.drinkType || "Fluid Intake";
            }

            return (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 transition-smooth hover:bg-muted/50 group"
              >
                <div className={`${bgColor} p-2 rounded-full`}>
                  <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(event.timestamp), "h:mm a")}
                      </span>
                      {(onEdit || onDelete) && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onEdit(event)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                              onClick={() => onDelete(event.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    {event.volume && (
                      <p className="text-xs text-muted-foreground">
                        Volume: {event.type === "fluid" ? `${event.volume}ml` : `${event.volume}%`}
                      </p>
                    )}
                    {event.urgency && (
                      <p className="text-xs text-muted-foreground">
                        Urgency: {event.urgency}/5
                      </p>
                    )}
                    {event.severity && (
                      <p className="text-xs text-muted-foreground">
                        Severity: {event.severity}/5
                      </p>
                    )}
                    {event.trigger && (
                      <p className="text-xs text-muted-foreground">Trigger: {event.trigger}</p>
                    )}
                    {event.notes && (
                      <p className="text-xs text-muted-foreground italic">{event.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
