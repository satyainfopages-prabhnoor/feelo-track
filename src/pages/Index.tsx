import { useState } from "react";
import MoodTracker from "@/components/MoodTracker";
import MoodHistory from "@/components/MoodHistory";

const Index = () => {
  const [currentView, setCurrentView] = useState<"tracker" | "history">("tracker");

  return (
    <>
      {currentView === "tracker" ? (
        <MoodTracker onViewHistory={() => setCurrentView("history")} />
      ) : (
        <MoodHistory onBack={() => setCurrentView("tracker")} />
      )}
    </>
  );
};

export default Index;
