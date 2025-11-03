import { StatsCard } from "../StatsCard";
import { BookOpen, Users, FileText, TrendingUp } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <StatsCard title="Departments" value={45} icon={BookOpen} />
      <StatsCard title="Courses" value="1,200+" icon={FileText} />
      <StatsCard title="Files Shared" value="8,500+" icon={FileText} />
      <StatsCard title="Active Students" value="3,400+" icon={Users} description="Contributing daily" />
    </div>
  );
}
