import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, TrendingUp } from "lucide-react";
import { MoodEntry } from "./MoodTracker";
import MoodChart from "./MoodChart";

const moods = [
  { emoji: "😞", label: "Very Sad", value: 1 },
  { emoji: "😕", label: "Sad", value: 2 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "😊", label: "Happy", value: 4 },
  { emoji: "😁", label: "Very Happy", value: 5 },
];

interface MoodHistoryProps {
  onBack: () => void;
}

export default function MoodHistory({ onBack }: MoodHistoryProps) {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"history" | "chart">("history");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("moodEntries") || "[]");
    const sorted = stored.sort((a: MoodEntry, b: MoodEntry) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setEntries(sorted);
  }, []);

  const getMoodData = (value: number) => moods.find(m => m.value === value);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const averageMood = entries.length > 0 
    ? (entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Mood {activeTab === "history" ? "History" : "Insights"}
          </h1>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-background rounded-lg p-1 shadow-soft">
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
              activeTab === "history" 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="w-4 h-4" />
            History
          </button>
          <button
            onClick={() => setActiveTab("chart")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
              activeTab === "chart" 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Insights
          </button>
        </div>

        {activeTab === "history" ? (
          /* History View */
          <div className="space-y-4">
            {entries.length === 0 ? (
              <Card className="p-8 text-center bg-gradient-card shadow-soft">
                <p className="text-muted-foreground">No mood entries yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start tracking your daily mood to see your history here.
                </p>
              </Card>
            ) : (
              entries.map((entry) => {
                const moodData = getMoodData(entry.mood);
                return (
                  <Card key={entry.id} className="p-4 bg-gradient-card shadow-soft border-0">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{moodData?.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">{moodData?.label}</h3>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(entry.date)}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground">{entry.note}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        ) : (
          /* Insights View */
          <div className="space-y-6">
            {/* Stats */}
            <Card className="p-6 bg-gradient-card shadow-soft border-0">
              <h3 className="font-semibold mb-4">Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{entries.length}</div>
                  <div className="text-sm text-muted-foreground">Total Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{averageMood}</div>
                  <div className="text-sm text-muted-foreground">Average Mood</div>
                </div>
              </div>
            </Card>

            {/* Chart */}
            {entries.length > 0 && <MoodChart entries={entries} />}
          </div>
        )}
      </div>
    </div>
  );
}