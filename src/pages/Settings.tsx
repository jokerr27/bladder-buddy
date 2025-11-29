import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Bell, Moon, Sun, Trash2, Download, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const STORAGE_KEY = "bladder-buddy-events";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(false);
  const [volumeUnit, setVolumeUnit] = useState("ml");
  const [reminderInterval, setReminderInterval] = useState("2");

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = theme === "dark";

  const handleDarkModeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  const handleExport = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
      toast({
        title: "No data to export",
        description: "You don't have any data saved yet.",
      });
        return;
      }

      const data = JSON.parse(stored);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bladder-buddy-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your data has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          toast({
            title: "Data imported",
            description: "Your data has been imported successfully. Please refresh the page.",
          });
        } catch (error) {
          console.error("Error importing data:", error);
          toast({
            title: "Import failed",
            description: "There was an error importing your data. Please check the file format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      toast({
        title: "Data cleared",
        description: "All your data has been cleared. Please refresh the page.",
      });
    }
  };

  return (
    <div className="min-h-screen gradient-calm">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border shadow-soft">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-xs text-muted-foreground">Manage your preferences</p>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Notifications */}
        <Card className="shadow-card border-0">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications" className="text-base">
                    Enable Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications for reminders
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reminders" className="text-base">
                    Hydration Reminders
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded to drink water regularly
                  </p>
                </div>
                <Switch
                  id="reminders"
                  checked={reminders}
                  onCheckedChange={setReminders}
                  disabled={!notifications}
                />
              </div>

              {reminders && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="reminder-interval">Reminder Interval</Label>
                  <Select value={reminderInterval} onValueChange={setReminderInterval}>
                    <SelectTrigger id="reminder-interval">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Every 1 hour</SelectItem>
                      <SelectItem value="2">Every 2 hours</SelectItem>
                      <SelectItem value="3">Every 3 hours</SelectItem>
                      <SelectItem value="4">Every 4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="shadow-card border-0">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              {mounted && isDarkMode ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              <h2 className="text-lg font-semibold">Appearance</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode" className="text-base">
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Switch to dark theme
                </p>
              </div>
              {mounted && (
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={handleDarkModeChange}
                />
              )}
            </div>
          </div>
        </Card>

        {/* Units */}
        <Card className="shadow-card border-0">
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold">Units</h2>
            
            <div className="space-y-2">
              <Label htmlFor="volume-unit">Volume Unit</Label>
              <Select value={volumeUnit} onValueChange={setVolumeUnit}>
                <SelectTrigger id="volume-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ml">Milliliters (ml)</SelectItem>
                  <SelectItem value="oz">Fluid Ounces (oz)</SelectItem>
                  <SelectItem value="cup">Cups</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="shadow-card border-0">
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold">Data Management</h2>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleImport}
              >
                <Upload className="h-4 w-4" />
                Import Data
              </Button>
              
              <Separator />
              
              <Button
                variant="destructive"
                className="w-full justify-start gap-2"
                onClick={handleClearData}
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="shadow-card border-0">
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">About</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Bladder Buddy v1.0.0</p>
              <p>Your wellness companion for tracking bladder health.</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Settings;

