import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FileCard } from "@/components/FileCard";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, Calendar } from "lucide-react";
import { useRoute, Link } from "wouter";
import emptyFolderImg from "@assets/generated_images/Empty_folder_illustration_576b343d.png";

const mockFiles = [
  {
    id: "1",
    title: "CSC201 Lecture Notes - Introduction to Python Programming.pdf",
    type: "pdf" as const,
    uploadedBy: "John Doe",
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    downloadCount: 145,
    verified: true,
  },
  {
    id: "2",
    title: "Week 3 - Control Structures and Loops.pdf",
    type: "pdf" as const,
    uploadedBy: "Jane Smith",
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    downloadCount: 89,
    verified: true,
  },
  {
    id: "3",
    title: "Python Syntax Cheat Sheet.png",
    type: "image" as const,
    uploadedBy: "Mike Johnson",
    uploadedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    downloadCount: 234,
    verified: false,
  },
  {
    id: "4",
    title: "Final Exam Study Guide.docx",
    type: "docx" as const,
    uploadedBy: "Sarah Williams",
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    downloadCount: 178,
    verified: true,
  },
];

export default function Course() {
  const [, params] = useRoute("/course/:id");
  const courseId = params?.id || "";

  const handleDownload = (fileId: string) => {
    console.log("Download file:", fileId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-8">
        <Breadcrumbs
          items={[
            { label: "Computer Science", href: "/department/computer-science" },
            { label: "200 Level", href: "/department/computer-science" },
            { label: "CSC 201" },
          ]}
        />

        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-2xl font-mono font-bold tracking-wide">CSC201</code>
                <Badge variant="secondary">200L</Badge>
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  First Semester
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Introduction to Programming
              </h1>
              <p className="text-muted-foreground max-w-3xl">
                Fundamentals of programming using Python. Topics include variables, data types, 
                control structures, functions, and basic algorithms.
              </p>
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
              <span className="font-medium text-foreground">{mockFiles.length}</span> files
            </div>
            <div>
              <span className="font-medium text-foreground">
                {mockFiles.reduce((acc, file) => acc + file.downloadCount, 0)}
              </span>{" "}
              total downloads
            </div>
            <div>
              <span className="font-medium text-foreground">
                {new Set(mockFiles.map((f) => f.uploadedBy)).size}
              </span>{" "}
              contributors
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Course Materials</h2>
        </div>

        {mockFiles.length > 0 ? (
          <div className="grid gap-4">
            {mockFiles.map((file) => (
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
