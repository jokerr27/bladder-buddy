import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Droplets, TrendingUp, Settings } from "lucide-react";
import { QuickLogDialog } from "@/components/QuickLogDialog";
import { FluidIntakeDialog } from "@/components/FluidIntakeDialog";
import { DailySummary } from "@/components/DailySummary";
import { Timeline } from "@/components/Timeline";

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

const Index = () => {
  const [events, setEvents] = useState<BladderEvent[]>([]);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [showFluidLog, setShowFluidLog] = useState(false);

  const addEvent = (event: Omit<BladderEvent, "id">) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents([...events, newEvent]);
  };

  const todayEvents = events.filter(
    (e) => new Date(e.timestamp).toDateString() === new Date().toDateString()
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
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
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
        <DailySummary events={todayEvents} />

        {/* Timeline */}
        <Timeline events={todayEvents} />

        {/* Encouragement Card */}
        {todayEvents.length > 0 && (
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
        onOpenChange={setShowQuickLog}
        onSave={(data) => {
          addEvent({
            ...data,
            timestamp: new Date(),
          });
          setShowQuickLog(false);
        }}
      />

      <FluidIntakeDialog
        open={showFluidLog}
        onOpenChange={setShowFluidLog}
        onSave={(data) => {
          addEvent({
            type: "fluid",
            timestamp: new Date(),
            ...data,
          });
          setShowFluidLog(false);
        }}
      />
    </div>
  );
};

export default Index;
