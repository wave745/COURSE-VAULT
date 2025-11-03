import { LevelSelector } from "../LevelSelector";
import { useState } from "react";

export default function LevelSelectorExample() {
  const [level, setLevel] = useState(200);
  return (
    <div className="p-6 max-w-2xl">
      <LevelSelector selectedLevel={level} onLevelChange={setLevel} />
      <p className="text-sm text-muted-foreground mt-4">Selected: {level}L</p>
    </div>
  );
}
