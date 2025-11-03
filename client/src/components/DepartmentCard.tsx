import { Card } from "@/components/ui/card";
import { BookOpen, FileText } from "lucide-react";
import { Link } from "wouter";

interface DepartmentCardProps {
  id: string;
  name: string;
  slug: string;
  description?: string;
  courseCount: number;
  fileCount?: number;
}

export function DepartmentCard({
  id,
  name,
  slug,
  description,
  courseCount,
  fileCount,
}: DepartmentCardProps) {
  return (
    <Link href={`/department/${slug}`} data-testid={`link-department-${id}`}>
      <Card className="p-6 hover-elevate active-elevate-2 cursor-pointer h-full flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold mb-2 line-clamp-2" data-testid={`text-department-name-${id}`}>
              {name}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto pt-2 border-t">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span data-testid={`text-course-count-${id}`}>{courseCount} courses</span>
          </div>
          {fileCount !== undefined && (
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{fileCount} files</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
