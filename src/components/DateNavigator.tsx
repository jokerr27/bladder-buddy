import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { format, isSameDay, addDays, subDays } from "date-fns";
import { cn } from "@/lib/utils";

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateNavigator({ selectedDate, onDateChange }: DateNavigatorProps) {
  const today = new Date();
  const isToday = isSameDay(selectedDate, today);
  const isFuture = selectedDate > today;

  const goToPreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const goToNextDay = () => {
    if (!isToday) {
      onDateChange(addDays(selectedDate, 1));
    }
  };

  const goToToday = () => {
    onDateChange(today);
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousDay}
        className="h-9 w-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex-1 justify-center gap-2 font-normal",
              isToday && "bg-primary/10 border-primary"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="text-sm">
              {isToday ? "Today" : format(selectedDate, "MMM d, yyyy")}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date && date <= today) {
                onDateChange(date);
              }
            }}
            disabled={(date) => date > today}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        onClick={goToNextDay}
        disabled={isToday || isFuture}
        className="h-9 w-9"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {!isToday && (
        <Button
          variant="ghost"
          size="sm"
          onClick={goToToday}
          className="text-xs"
        >
          Today
        </Button>
      )}
    </div>
  );
}

