import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar } from "lucide-react";
import { Link } from "wouter";

interface CourseCardProps {
  id: string;
  code: string;
  title: string;
  semester: "First" | "Second";
  level: number;
  fileCount: number;
  description?: string;
}

export function CourseCard({
  id,
  code,
  title,
  semester,
  level,
  fileCount,
  description,
}: CourseCardProps) {
  return (
    <Link href={`/course/${id}`} data-testid={`link-course-${id}`}>
      <Card className="p-4 hover-elevate active-elevate-2 cursor-pointer">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <code className="font-mono text-sm font-semibold tracking-wide" data-testid={`text-course-code-${id}`}>
                {code}
              </code>
              <Badge variant="secondary" className="text-xs">
                {level}L
              </Badge>
              <Badge variant="outline" className="text-xs gap-1">
                <Calendar className="h-3 w-3" />
                {semester} Semester
              </Badge>
            </div>
            <h3 className="font-semibold mb-1 line-clamp-1" data-testid={`text-course-title-${id}`}>
              {title}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 flex items-center gap-1 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span data-testid={`text-file-count-${id}`}>{fileCount}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
