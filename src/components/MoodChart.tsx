import { Card } from "@/components/ui/card";
import { MoodEntry } from "./MoodTracker";

interface MoodChartProps {
  entries: MoodEntry[];
}

export default function MoodChart({ entries }: MoodChartProps) {
  // Get last 7 days for the chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const chartData = last7Days.map(date => {
    const entry = entries.find(e => e.date === date);
    return {
      date,
      mood: entry?.mood || 0,
      hasEntry: !!entry,
    };
  });

  const maxMood = 5;
  const chartHeight = 120;

  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).substr(0, 3);
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-soft border-0">
      <h3 className="font-semibold mb-4">Last 7 Days</h3>
      
      <div className="relative">
        {/* Chart area */}
        <div className="flex items-end justify-between gap-2 mb-4" style={{ height: chartHeight }}>
          {chartData.map((data, index) => {
            const height = data.hasEntry ? (data.mood / maxMood) * chartHeight : 0;
            const colorClass = data.hasEntry ? getMoodColor(data.mood) : "bg-muted";
            
            return (
              <div key={data.date} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${colorClass}`}
                  style={{ height: `${height}px` }}
                />
                {data.hasEntry && (
                  <div className="text-xs font-medium mt-1 text-center">
                    {getMoodEmoji(data.mood)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          {chartData.map((data) => (
            <div key={data.date} className="text-center flex-1">
              {formatDateLabel(data.date)}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-mood-very-sad"></div>
          <span>Very Sad</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-mood-neutral"></div>
          <span>Neutral</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-mood-very-happy"></div>
          <span>Very Happy</span>
        </div>
      </div>
    </Card>
  );
}

function getMoodColor(mood: number): string {
  switch (mood) {
    case 1: return "bg-mood-very-sad";
    case 2: return "bg-mood-sad";
    case 3: return "bg-mood-neutral";
    case 4: return "bg-mood-happy";
    case 5: return "bg-mood-very-happy";
    default: return "bg-muted";
  }
}

function getMoodEmoji(mood: number): string {
  switch (mood) {
    case 1: return "😞";
    case 2: return "😕";
    case 3: return "😐";
    case 4: return "😊";
    case 5: return "😁";
    default: return "";
  }
}