import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Droplets, AlertCircle, CalendarIcon, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { BladderEvent } from "@/pages/Index";

interface QuickLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  event?: BladderEvent | null;
  onSave: (data: {
    type: "urination" | "leak";
    volume?: number;
    urgency?: number;
    severity?: number;
    trigger?: string;
    notes?: string;
    timestamp: Date;
  }) => void;
}

const TRIGGERS = [
  "Caffeine",
  "Exercise",
  "Sneezing",
  "Coughing",
  "Laughing",
  "Standing up",
  "Running",
  "Other",
];

export function QuickLogDialog({ open, onOpenChange, selectedDate, event, onSave }: QuickLogDialogProps) {
  const [type, setType] = useState<"urination" | "leak">("urination");
  const [volume, setVolume] = useState(50);
  const [urgency, setUrgency] = useState(3);
  const [severity, setSeverity] = useState(2);
  const [trigger, setTrigger] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date>(selectedDate || new Date());
  const [time, setTime] = useState("12:00");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const isEditing = !!event;

  // Load event data when editing
  useEffect(() => {
    if (event && open) {
      setType(event.type === "urination" ? "urination" : "leak");
      setVolume(event.volume || 50);
      setUrgency(event.urgency || 3);
      setSeverity(event.severity || 2);
      setTrigger(event.trigger || "");
      setNotes(event.notes || "");
      const eventDate = new Date(event.timestamp);
      setDate(eventDate);
      setTime(format(eventDate, "HH:mm"));
    } else if (open && !event) {
      // Reset form for new event
      setType("urination");
      setVolume(50);
      setUrgency(3);
      setSeverity(2);
      setTrigger("");
      setNotes("");
      setDate(selectedDate || new Date());
      const now = new Date();
      setTime(format(now, "HH:mm"));
    }
  }, [event, open, selectedDate]);

  // Update date when selectedDate prop changes (only if not editing)
  useEffect(() => {
    if (selectedDate && !event) {
      setDate(selectedDate);
    }
  }, [selectedDate, event]);

  const handleSave = () => {
    // Parse time and set it on the date
    const eventDate = new Date(date);
    const [hours, minutes] = time.split(":").map(Number);
    eventDate.setHours(hours);
    eventDate.setMinutes(minutes);
    eventDate.setSeconds(0);
    eventDate.setMilliseconds(0);

    onSave({
      type,
      volume,
      urgency: type === "urination" ? urgency : undefined,
      severity: type === "leak" ? severity : undefined,
      trigger: trigger || undefined,
      notes: notes || undefined,
      timestamp: eventDate,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Event" : "Quick Log"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selected) => {
                    if (selected) {
                      setDate(selected);
                      setCalendarOpen(false);
                    }
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {format(date, "yyyy-MM-dd") !== format(new Date(), "yyyy-MM-dd") && (
              <p className="text-xs text-muted-foreground">
                {isEditing ? "Editing event from" : "Logging for"} {format(date, "MMM d, yyyy")}
              </p>
            )}
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label>Time</Label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label>Event Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={type === "urination" ? "default" : "outline"}
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => setType("urination")}
              >
                <Droplets className="h-5 w-5" />
                <span>Urination</span>
              </Button>
              <Button
                type="button"
                variant={type === "leak" ? "default" : "outline"}
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => setType("leak")}
              >
                <AlertCircle className="h-5 w-5" />
                <span>Leak/Accident</span>
              </Button>
            </div>
          </div>

          {/* Volume */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Estimated Volume</Label>
              <span className="text-sm text-muted-foreground">{volume}%</span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={(v) => setVolume(v[0])}
              max={100}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>

          {/* Urgency (for urination) */}
          {type === "urination" && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Urgency Level</Label>
                <span className="text-sm text-muted-foreground">{urgency}/5</span>
              </div>
              <Slider
                value={[urgency]}
                onValueChange={(v) => setUrgency(v[0])}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>No urgency</span>
                <span>Very urgent</span>
              </div>
            </div>
          )}

          {/* Severity (for leaks) */}
          {type === "leak" && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Severity</Label>
                <span className="text-sm text-muted-foreground">{severity}/5</span>
              </div>
              <Slider
                value={[severity]}
                onValueChange={(v) => setSeverity(v[0])}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Minimal</span>
                <span>Severe</span>
              </div>
            </div>
          )}

          {/* Triggers */}
          <div className="space-y-2">
            <Label>Trigger (Optional)</Label>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map((t) => (
                <Badge
                  key={t}
                  variant={trigger === t ? "default" : "outline"}
                  className="cursor-pointer transition-smooth hover:scale-105"
                  onClick={() => setTrigger(trigger === t ? "" : t)}
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full transition-smooth hover:scale-105">
            {isEditing ? "Update Event" : "Save Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
