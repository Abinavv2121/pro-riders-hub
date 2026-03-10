
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Bell, Bike, Calendar, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

interface ReminderSettingsProps {
  onSave?: (settings: ReminderSettingsData) => void;
}

export interface ReminderSettingsData {
  enableTimeReminder: boolean;
  reminderMonths: number;
  enableKilometerReminder: boolean;
  reminderKilometers: number;
  notifyEmail: boolean;
  notifyWhatsApp: boolean;
}

const ReminderSettings = ({ onSave }: ReminderSettingsProps) => {
  const [settings, setSettings] = useState<ReminderSettingsData>({
    enableTimeReminder: true,
    reminderMonths: 3,
    enableKilometerReminder: false,
    reminderKilometers: 1000,
    notifyEmail: true,
    notifyWhatsApp: false,
  });

  const handleToggle = (key: keyof ReminderSettingsData) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNumberChange = (key: keyof ReminderSettingsData, value: string) => {
    const numValue = parseInt(value) || 0;
    setSettings((prev) => ({
      ...prev,
      [key]: numValue,
    }));
  };

  const handleSave = () => {
    onSave?.(settings);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Service Reminders
        </CardTitle>
        <CardDescription>Set up automatic reminders for your next service</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time-based Reminder */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Checkbox
                id="timeReminder"
                checked={settings.enableTimeReminder}
                onCheckedChange={() => handleToggle("enableTimeReminder")}
                className="mt-1"
              />
              <div>
                <Label htmlFor="timeReminder" className="flex items-center gap-2 cursor-pointer">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Time-based Reminder</span>
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Get reminded after a certain period
                </p>
              </div>
            </div>
          </div>

          {settings.enableTimeReminder && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="ml-7 pl-7 space-y-3"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Remind me every</span>
                <Input
                  type="number"
                  min="1"
                  max="24"
                  value={settings.reminderMonths}
                  onChange={(e) => handleNumberChange("reminderMonths", e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">month(s)</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Kilometer-based Reminder */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Checkbox
                id="kilometerReminder"
                checked={settings.enableKilometerReminder}
                onCheckedChange={() => handleToggle("enableKilometerReminder")}
                className="mt-1"
              />
              <div>
                <Label htmlFor="kilometerReminder" className="flex items-center gap-2 cursor-pointer">
                  <Bike className="w-4 h-4" />
                  <span className="font-medium">Kilometer-based Reminder</span>
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Get reminded after riding a certain distance
                </p>
              </div>
            </div>
          </div>

          {settings.enableKilometerReminder && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="ml-7 pl-7 space-y-3"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Remind me after</span>
                <Input
                  type="number"
                  min="100"
                  max="10000"
                  step="100"
                  value={settings.reminderKilometers}
                  onChange={(e) => handleNumberChange("reminderKilometers", e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">km</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Notification Preferences */}
        <div className="border-t pt-6">
          <p className="font-medium mb-4">Notification Preferences</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="notifyEmail"
                checked={settings.notifyEmail}
                onCheckedChange={() => handleToggle("notifyEmail")}
              />
              <Label htmlFor="notifyEmail" className="flex items-center gap-2 cursor-pointer">
                <Mail className="w-4 h-4" />
                <span>Email notifications</span>
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="notifyWhatsApp"
                checked={settings.notifyWhatsApp}
                onCheckedChange={() => handleToggle("notifyWhatsApp")}
              />
              <Label htmlFor="notifyWhatsApp" className="flex items-center gap-2 cursor-pointer">
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp notifications</span>
              </Label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full">
          <Bell className="w-4 h-4 mr-2" />
          Save Reminder Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReminderSettings;

