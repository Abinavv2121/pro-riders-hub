
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useState } from "react";

export interface TimeSlot {
  id: string;
  time: string;
  displayTime: string;
  available: boolean;
}

interface TimeSlotSelectorProps {
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
}

const defaultTimeSlots: TimeSlot[] = [
  { id: "slot-1", time: "09:00", displayTime: "9:00 AM", available: true },
  { id: "slot-2", time: "11:00", displayTime: "11:00 AM", available: true },
  { id: "slot-3", time: "13:00", displayTime: "1:00 PM", available: true },
  { id: "slot-4", time: "15:00", displayTime: "3:00 PM", available: true },
  { id: "slot-5", time: "17:00", displayTime: "5:00 PM", available: true },
];

const TimeSlotSelector = ({ selectedSlot, onSlotSelect }: TimeSlotSelectorProps) => {
  const [slots] = useState<TimeSlot[]>(defaultTimeSlots);

  return (
    <Card className="w-full" style={{ backgroundColor: "#FFFFFF", color: "#000000" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#000000]">
          <Clock className="w-5 h-5" />
          Select Time Slot
        </CardTitle>
        <CardDescription className="text-[#000000]">Choose a convenient time for your appointment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot.id;

            return (
              <motion.button
                key={slot.id}
                whileHover={slot.available ? { scale: 1.05 } : {}}
                whileTap={slot.available ? { scale: 0.95 } : {}}
                className={`p-4 rounded-lg border-2 transition-all ${
                  !slot.available
                    ? "border-muted bg-muted/30 cursor-not-allowed opacity-50"
                    : isSelected
                    ? "border-primary bg-primary cursor-pointer"
                    : "border-border hover:border-primary/50 cursor-pointer"
                }`}
                onClick={() => slot.available && onSlotSelect(slot.id)}
                disabled={!slot.available}
              >
                <div className="text-center">
                  <span className={`font-heading font-semibold ${isSelected ? "text-black" : ""}`}>
                    {slot.displayTime}
                  </span>
                  {!slot.available && (
                    <p className="text-xs text-[#000000] mt-1">Unavailable</p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {selectedSlot && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-primary rounded-lg p-3 text-center"
          >
            <p className="text-sm text-white/80">Selected Time</p>
            <p className="font-heading font-semibold text-black">
              {slots.find((s) => s.id === selectedSlot)?.displayTime}
            </p>
          </motion.div>
        )}

        <p className="text-xs text-[#000000] text-center mt-4">
          Select a time slot to proceed with your booking
        </p>
      </CardContent>
    </Card>
  );
};

export default TimeSlotSelector;

