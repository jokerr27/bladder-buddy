import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Coffee, Wine, Droplet, Milk } from "lucide-react";

interface FluidIntakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    drinkType: string;
    volume: number;
    caffeine: boolean;
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

export function FluidIntakeDialog({ open, onOpenChange, onSave }: FluidIntakeDialogProps) {
  const [drinkType, setDrinkType] = useState("Water");
  const [volume, setVolume] = useState(250);

  const handleSave = () => {
    const drink = DRINK_TYPES.find((d) => d.name === drinkType);
    onSave({
      drinkType,
      volume,
      caffeine: drink?.caffeine || false,
    });
    // Reset form
    setDrinkType("Water");
    setVolume(250);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Fluid Intake</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
            Save Intake
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
