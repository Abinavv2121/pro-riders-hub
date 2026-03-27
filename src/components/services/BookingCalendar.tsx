
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { useMemo, useState } from "react";

interface BookingCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  priorityBooking?: boolean;
  onPriorityChange?: (priority: boolean) => void;
}

const BookingCalendar = ({ selectedDate, onDateSelect, priorityBooking = false, onPriorityChange }: BookingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Get days in month
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [currentMonth]);

  // Check if a date is a weekday (Monday to Friday)
  const isWeekday = (date: Date): boolean => {
    const day = date.getDay();
    return day >= 1 && day <= 5;
  };

  // Check if a date is in the past
  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Check if date is selected
  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    if (isWeekday(date) && !isPastDate(date)) {
      onDateSelect(date);
    }
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <Card className="w-full" style={{ backgroundColor: "#FFFFFF", color: "#000000" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#000000]">
          <CalendarIcon className="w-5 h-5" />
          Select Appointment Date
        </CardTitle>
        <CardDescription className="text-[#000000]">Choose a weekday for your service appointment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-heading font-semibold text-lg text-[#000000]">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-xs font-medium text-[#000000] py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="h-10" />;
            }

            const weekday = isWeekday(date);
            const past = isPastDate(date);
            const selected = isSelected(date);
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <motion.button
                key={date.toISOString()}
                whileHover={weekday && !past ? { scale: 1.1 } : {}}
                whileTap={weekday && !past ? { scale: 0.95 } : {}}
                className={`h-10 rounded-lg text-sm font-medium transition-all ${
                  !weekday || past
                    ? "text-muted-foreground/30 cursor-not-allowed"
                    : "cursor-pointer hover:bg-primary/10"
                } ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : isToday
                    ? "bg-primary/20 text-primary font-bold"
                    : ""
                }`}
                onClick={() => handleDateClick(date)}
                disabled={!weekday || past}
              >
                {date.getDate()}
              </motion.button>
            );
          })}
        </div>

        {/* Selected Date Display */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted rounded-lg p-4 text-center"
          >
            <p className="text-sm text-[#000000]">Selected Date</p>
            <p className="font-heading font-semibold text-primary">{formatDate(selectedDate)}</p>
          </motion.div>
        )}

        {/* Priority Booking Option */}
        <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg" style={{ backgroundColor: "#FFFFFF", border: "1px solid #000000" }}>
          <Checkbox
            id="priority"
            checked={priorityBooking}
            onCheckedChange={(checked) => onPriorityChange?.(checked as boolean)}
          />
          <div className="flex-1">
            <Label htmlFor="priority" className="flex items-center gap-2 cursor-pointer text-[#000000]">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-[#000000]">Priority Booking</span>
            </Label>
            <p className="text-xs text-[#000000]">Get faster service with priority scheduling (+₹199)</p>
          </div>
        </div>

        {/* Info Text */}
        <div className="text-xs text-[#000000] text-center">
          <p>• Only weekdays (Monday - Friday) are available for booking</p>
          <p>• Past dates are not selectable</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCalendar;

