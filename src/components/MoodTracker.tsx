import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  note?: string;
}

const moods = [
  { emoji: "😞", label: "Very Sad", value: 1, color: "mood-very-sad" },
  { emoji: "😕", label: "Sad", value: 2, color: "mood-sad" },
  { emoji: "😐", label: "Neutral", value: 3, color: "mood-neutral" },
  { emoji: "😊", label: "Happy", value: 4, color: "mood-happy" },
  { emoji: "😁", label: "Very Happy", value: 5, color: "mood-very-happy" },
];

interface MoodTrackerProps {
  onViewHistory: () => void;
}

export default function MoodTracker({ onViewHistory }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Check if there's already an entry for today
    const entries = JSON.parse(localStorage.getItem("moodEntries") || "[]");
    const todayExisting = entries.find((entry: MoodEntry) => entry.date === today);
    if (todayExisting) {
      setTodayEntry(todayExisting);
      setSelectedMood(todayExisting.mood);
      setNote(todayExisting.note || "");
    }
  }, [today]);

  const saveMoodEntry = () => {
    if (selectedMood === null) return;

    const entry: MoodEntry = {
      id: todayEntry?.id || Date.now().toString(),
      date: today,
      mood: selectedMood,
      note: note.trim() || undefined,
    };

    const entries = JSON.parse(localStorage.getItem("moodEntries") || "[]");
    const updatedEntries = todayEntry
      ? entries.map((e: MoodEntry) => (e.id === todayEntry.id ? entry : e))
      : [...entries, entry];

    localStorage.setItem("moodEntries", JSON.stringify(updatedEntries));
    setTodayEntry(entry);
  };

  const selectedMoodData = moods.find(m => m.value === selectedMood);

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Daily Mood
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Mood Selector */}
        <Card className="p-6 bg-gradient-card shadow-soft border-0">
          <h2 className="text-lg font-semibold mb-4 text-center">
            How are you feeling today?
          </h2>
          
          <div className="grid grid-cols-5 gap-3 mb-6">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={cn(
                  "aspect-square rounded-full flex items-center justify-center text-3xl transition-all duration-300 hover:scale-110 border-2",
                  selectedMood === mood.value
                    ? `bg-${mood.color} border-${mood.color} shadow-mood scale-110`
                    : "bg-background border-border hover:border-primary"
                )}
              >
                {mood.emoji}
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className="text-center mb-4">
              <p className="text-lg font-medium">
                {selectedMoodData?.label}
              </p>
            </div>
          )}

          {/* Note Input */}
          <div className="space-y-3">
            <label htmlFor="note" className="text-sm font-medium">
              Optional note (what made you feel this way?)
            </label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write a note about your day..."
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={saveMoodEntry}
            disabled={selectedMood === null}
            className="w-full mt-4 bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            {todayEntry ? "Update Today's Mood" : "Save Today's Mood"}
          </Button>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onViewHistory}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            History
          </Button>
          <Button
            variant="outline"
            onClick={onViewHistory}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Insights
          </Button>
        </div>
      </div>
    </div>
  );
}