import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FileCard } from "@/components/FileCard";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, Calendar } from "lucide-react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Course, File, Department, College, User } from "@shared/schema";
import emptyFolderImg from "@assets/generated_images/Empty_folder_illustration_576b343d.png";

export default function Course() {
  const [, params] = useRoute("/course/:id");
  const courseId = params?.id || "";

  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: ["/api/courses", courseId],
    enabled: !!courseId,
  });

  const { data: files = [], isLoading: filesLoading } = useQuery<File[]>({
    queryKey: ["/api/courses", courseId, "files"],
    enabled: !!courseId,
  });

  const { data: department } = useQuery<Department>({
    queryKey: ["/api/departments", course?.departmentId],
    enabled: !!course?.departmentId,
  });

  const { data: college } = useQuery<College>({
    queryKey: ["/api/colleges", department?.collegeId],
    enabled: !!department?.collegeId,
  });

  // Get user data for file uploaders (we'll need to enhance the API to include this)
  const isLoading = courseLoading || filesLoading;

  const handleDownload = (fileId: string) => {
    console.log("Download file:", fileId);
    // TODO: Implement actual download functionality
  };

  // Transform files to match FileCard component expectations
  const fileCards = files.map((file) => {
    const fileType = file.fileType.toLowerCase();
    let type: "pdf" | "image" | "docx" | "other" = "other";
    if (fileType.includes("pdf")) type = "pdf";
    else if (fileType.includes("image") || ["png", "jpg", "jpeg", "gif"].some(ext => fileType.includes(ext))) type = "image";
    else if (fileType.includes("docx") || fileType.includes("doc")) type = "docx";

    return {
      id: file.id,
      title: file.title,
      type,
      uploadedBy: "User", // TODO: Get actual user name from userId
      uploadedAt: file.uploadedAt,
      downloadCount: file.downloadCount,
      verified: file.verified,
    };
  });

  const totalDownloads = files.reduce((acc, file) => acc + file.downloadCount, 0);
  const uniqueContributors = new Set(files.map((f) => f.userId)).size;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 py-8">
          <EmptyState
            imageSrc={emptyFolderImg}
            title="Course not found"
            description="The course you're looking for doesn't exist."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-8">
        <Breadcrumbs
          items={[
            { label: college?.name || "College", href: college ? `/college/${college.slug}` : undefined },
            { label: department?.name || "Department", href: department ? `/department/${department.slug}` : undefined },
            { label: course.code },
          ]}
        />

        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-2xl font-mono font-bold tracking-wide">{course.code}</code>
                <Badge variant="secondary">{course.level}L</Badge>
                {course.semester && (
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {course.semester}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
              {course.description && (
                <p className="text-muted-foreground max-w-3xl">{course.description}</p>
              )}
            </div>
            <Link href="/upload">
              <Button className="gap-2 flex-shrink-0" data-testid="button-upload-course">
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
            </Link>
          </div>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">{files.length}</span> files
            </div>
            <div>
              <span className="font-medium text-foreground">{totalDownloads}</span> total downloads
            </div>
            <div>
              <span className="font-medium text-foreground">{uniqueContributors}</span> contributors
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Course Materials</h2>
        </div>

        {fileCards.length > 0 ? (
          <div className="grid gap-4">
            {fileCards.map((file) => (
              <FileCard
                key={file.id}
                {...file}
                onDownload={() => handleDownload(file.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            imageSrc={emptyFolderImg}
            title="No files yet"
            description="Be the first to upload study materials for this course!"
            actionLabel="Upload File"
            onAction={() => console.log("Upload clicked")}
          />
        )}
      </div>
    </div>
  );
}
