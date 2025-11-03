import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Image, File, Download, CheckCircle2, User, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface FileCardProps {
  id: string;
  title: string;
  type: "pdf" | "image" | "docx" | "other";
  uploadedBy: string;
  uploadedAt: Date;
  downloadCount: number;
  verified?: boolean;
  onDownload?: () => void;
}

const fileIcons = {
  pdf: FileText,
  image: Image,
  docx: FileText,
  other: File,
};

const fileColors = {
  pdf: "text-red-500",
  image: "text-blue-500",
  docx: "text-blue-600",
  other: "text-gray-500",
};

export function FileCard({
  id,
  title,
  type,
  uploadedBy,
  uploadedAt,
  downloadCount,
  verified,
  onDownload,
}: FileCardProps) {
  const Icon = fileIcons[type];

  return (
    <Card className="p-4 hover-elevate active-elevate-2">
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 ${fileColors[type]}`}>
          <Icon className="h-8 w-8" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold line-clamp-2" data-testid={`text-file-title-${id}`}>
              {title}
            </h4>
            {verified && (
              <Badge variant="secondary" className="gap-1 flex-shrink-0 text-xs">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{uploadedBy}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDistanceToNow(uploadedAt, { addSuffix: true })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span data-testid={`text-download-count-${id}`}>{downloadCount} downloads</span>
            </div>
            <Badge variant="outline" className="text-xs uppercase">
              {type}
            </Badge>
          </div>
        </div>

        <Button
          size="sm"
          variant="default"
          className="gap-2 flex-shrink-0"
          onClick={onDownload}
          data-testid={`button-download-${id}`}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>
    </Card>
  );
}
