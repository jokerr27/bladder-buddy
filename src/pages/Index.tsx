import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Droplets, TrendingUp, Settings } from "lucide-react";
import { QuickLogDialog } from "@/components/QuickLogDialog";
import { FluidIntakeDialog } from "@/components/FluidIntakeDialog";
import { DailySummary } from "@/components/DailySummary";
import { Timeline } from "@/components/Timeline";
import { LeakHeatmap } from "@/components/LeakHeatmap";
import { DateNavigator } from "@/components/DateNavigator";
import { format, isSameDay } from "date-fns";

export interface BladderEvent {
  id: string;
  timestamp: Date;
  type: "urination" | "leak" | "fluid";
  volume?: number;
  urgency?: number;
  severity?: number;
  trigger?: string;
  notes?: string;
  drinkType?: string;
  caffeine?: boolean;
}

const STORAGE_KEY = "bladder-buddy-events";

const Index = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<BladderEvent[]>([]);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [showFluidLog, setShowFluidLog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [viewingDate, setViewingDate] = useState<Date>(new Date());
  const [editingEvent, setEditingEvent] = useState<BladderEvent | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  // Load events from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const eventsWithDates = parsed.map((e: BladderEvent) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }));
        setEvents(eventsWithDates);
      } catch (error) {
        console.error("Error loading events from localStorage:", error);
      }
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  }, [events]);

  const addEvent = (event: Omit<BladderEvent, "id">) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (eventId: string, updatedEvent: Omit<BladderEvent, "id">) => {
    setEvents(events.map((e) => (e.id === eventId ? { ...updatedEvent, id: eventId } : e)));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId));
  };

  const handleEdit = (event: BladderEvent) => {
    setEditingEvent(event);
    if (event.type === "fluid") {
      setShowFluidLog(true);
    } else {
      setShowQuickLog(true);
    }
  };

  const handleDelete = (eventId: string) => {
    setDeleteEventId(eventId);
  };

  const confirmDelete = () => {
    if (deleteEventId) {
      deleteEvent(deleteEventId);
      setDeleteEventId(null);
    }
  };

  // Get events for the currently viewed date
  const viewedDateEvents = events.filter(
    (e) => format(new Date(e.timestamp), "yyyy-MM-dd") === format(viewingDate, "yyyy-MM-dd")
  );

  return (
    <div className="min-h-screen gradient-calm">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border shadow-soft">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bladr
            </h1>
            <p className="text-xs text-muted-foreground">Your wellness companion</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Date Navigator */}
        <Card className="shadow-card border-0">
          <div className="p-4">
            <DateNavigator
              selectedDate={viewingDate}
              onDateChange={setViewingDate}
            />
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card border-0 overflow-hidden">
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Quick Log</h2>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowQuickLog(true)}
                className="h-auto py-4 flex flex-col gap-2 transition-smooth hover:scale-105"
                variant="default"
              >
                <Droplets className="h-6 w-6" />
                <span>Log Event</span>
              </Button>
              <Button
                onClick={() => setShowFluidLog(true)}
                className="h-auto py-4 flex flex-col gap-2 transition-smooth hover:scale-105"
                variant="secondary"
              >
                <Plus className="h-6 w-6" />
                <span>Add Drink</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Daily Summary */}
        <DailySummary events={viewedDateEvents} date={viewingDate} />

        {/* Leak Heatmap */}
        <LeakHeatmap 
          events={events} 
          onDateClick={(date) => {
            setViewingDate(date);
          }}
        />

        {/* Timeline */}
        <Timeline 
          events={viewedDateEvents} 
          date={viewingDate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Encouragement Card */}
        {viewedDateEvents.length > 0 && (
          <Card className="shadow-card border-0 gradient-primary">
            <div className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary-foreground" />
              <p className="text-primary-foreground font-medium">
                You're doing great! Keep tracking your progress.
              </p>
            </div>
          </Card>
        )}
      </main>

      {/* Dialogs */}
      <QuickLogDialog
        open={showQuickLog}
        onOpenChange={(open) => {
          setShowQuickLog(open);
          if (!open) {
            setSelectedDate(undefined);
            setEditingEvent(null);
          }
        }}
        selectedDate={selectedDate}
        event={editingEvent && editingEvent.type !== "fluid" ? editingEvent : null}
        onSave={(data) => {
          if (editingEvent && editingEvent.type !== "fluid") {
            updateEvent(editingEvent.id, {
              ...data,
              timestamp: data.timestamp,
            });
          } else {
            addEvent({
              ...data,
              timestamp: data.timestamp,
            });
          }
          setShowQuickLog(false);
          setSelectedDate(undefined);
          setEditingEvent(null);
        }}
      />

      <FluidIntakeDialog
        open={showFluidLog}
        onOpenChange={(open) => {
          setShowFluidLog(open);
          if (!open) {
            setSelectedDate(undefined);
            setEditingEvent(null);
          }
        }}
        selectedDate={selectedDate}
        event={editingEvent && editingEvent.type === "fluid" ? editingEvent : null}
        onSave={(data) => {
          if (editingEvent && editingEvent.type === "fluid") {
            updateEvent(editingEvent.id, {
              type: "fluid",
              timestamp: data.timestamp,
              ...data,
            });
          } else {
            addEvent({
              type: "fluid",
              timestamp: data.timestamp,
              ...data,
            });
          }
          setShowFluidLog(false);
          setSelectedDate(undefined);
          setEditingEvent(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteEventId} onOpenChange={(open) => !open && setDeleteEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
