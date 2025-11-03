import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LevelSelectorProps {
  selectedLevel: number;
  onLevelChange: (level: number) => void;
  availableLevels?: number[];
}

export function LevelSelector({
  selectedLevel,
  onLevelChange,
  availableLevels = [100, 200, 300, 400, 500, 600],
}: LevelSelectorProps) {
  return (
    <Tabs value={selectedLevel.toString()} onValueChange={(val) => onLevelChange(Number(val))}>
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-2 bg-transparent h-auto p-0">
        {availableLevels.map((level) => (
          <TabsTrigger
            key={level}
            value={level.toString()}
            data-testid={`button-level-${level}`}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {level}L
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
