import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Droplets, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuickLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    type: "urination" | "leak";
    volume?: number;
    urgency?: number;
    severity?: number;
    trigger?: string;
    notes?: string;
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

export function QuickLogDialog({ open, onOpenChange, onSave }: QuickLogDialogProps) {
  const [type, setType] = useState<"urination" | "leak">("urination");
  const [volume, setVolume] = useState(50);
  const [urgency, setUrgency] = useState(3);
  const [severity, setSeverity] = useState(2);
  const [trigger, setTrigger] = useState<string>("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    onSave({
      type,
      volume,
      urgency: type === "urination" ? urgency : undefined,
      severity: type === "leak" ? severity : undefined,
      trigger: trigger || undefined,
      notes: notes || undefined,
    });
    // Reset form
    setType("urination");
    setVolume(50);
    setUrgency(3);
    setSeverity(2);
    setTrigger("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Log</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
            Save Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
