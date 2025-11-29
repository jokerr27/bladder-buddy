import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Coffee, Wine, Droplet, Milk, CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { BladderEvent } from "@/pages/Index";

interface FluidIntakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  event?: BladderEvent | null;
  onSave: (data: {
    drinkType: string;
    volume: number;
    caffeine: boolean;
    timestamp: Date;
  }) => void;
}

const DRINK_TYPES = [
  { name: "Water", icon: Droplet, caffeine: false },
  { name: "Coffee", icon: Coffee, caffeine: true },
  { name: "Tea", icon: Coffee, caffeine: true },
  { name: "Juice", icon: Droplet, caffeine: false },
  { name: "Soda", icon: Droplet, caffeine: true },
  { name: "Alcohol", icon: Wine, caffeine: false },
  { name: "Milk", icon: Milk, caffeine: false },
];

export function FluidIntakeDialog({ open, onOpenChange, selectedDate, event, onSave }: FluidIntakeDialogProps) {
  const [drinkType, setDrinkType] = useState("Water");
  const [volume, setVolume] = useState(250);
  const [date, setDate] = useState<Date>(selectedDate || new Date());
  const [time, setTime] = useState("12:00");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const isEditing = !!event;

  // Load event data when editing
  useEffect(() => {
    if (event && open) {
      setDrinkType(event.drinkType || "Water");
      setVolume(event.volume || 250);
      const eventDate = new Date(event.timestamp);
      setDate(eventDate);
      setTime(format(eventDate, "HH:mm"));
    } else if (open && !event) {
      // Reset form for new event
      setDrinkType("Water");
      setVolume(250);
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

    const drink = DRINK_TYPES.find((d) => d.name === drinkType);
    onSave({
      drinkType,
      volume,
      caffeine: drink?.caffeine || false,
      timestamp: eventDate,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Fluid Intake" : "Log Fluid Intake"}</DialogTitle>
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

          {/* Drink Type */}
          <div className="space-y-3">
            <Label>Drink Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {DRINK_TYPES.map((drink) => {
                const Icon = drink.icon;
                return (
                  <Button
                    key={drink.name}
                    type="button"
                    variant={drinkType === drink.name ? "default" : "outline"}
                    className="h-auto py-3 flex items-center gap-2 justify-start transition-smooth hover:scale-105"
                    onClick={() => setDrinkType(drink.name)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{drink.name}</span>
                    {drink.caffeine && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        C
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Volume */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Volume</Label>
              <span className="text-sm text-muted-foreground">{volume}ml</span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={(v) => setVolume(v[0])}
              min={50}
              max={1000}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50ml</span>
              <span>1000ml</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              {DRINK_TYPES.find((d) => d.name === drinkType)?.caffeine && (
                <span className="text-warning font-medium">⚠️ Contains caffeine</span>
              )}
              {!DRINK_TYPES.find((d) => d.name === drinkType)?.caffeine && (
                <span>Great choice for bladder health! 💧</span>
              )}
            </p>
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full transition-smooth hover:scale-105">
            {isEditing ? "Update Intake" : "Save Intake"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
