import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCard } from "@/components/FileCard";
import { EmptyState } from "@/components/EmptyState";
import { Trophy, Upload, Download, TrendingUp } from "lucide-react";
import emptyUploadsImg from "@assets/generated_images/No_uploads_illustration_ff0e0389.png";

const mockUploads = [
  {
    id: "1",
    title: "CSC201 Lecture Notes - Introduction to Python.pdf",
    type: "pdf" as const,
    uploadedBy: "You",
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    downloadCount: 145,
    verified: true,
  },
  {
    id: "2",
    title: "Data Structures Flowchart.png",
    type: "image" as const,
    uploadedBy: "You",
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    downloadCount: 89,
    verified: false,
  },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-8">
        <Card className="p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                JD
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2" data-testid="text-profile-name">
                John Doe
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary">Computer Science & IT</Badge>
                <Badge variant="secondary">300 Level</Badge>
                <Badge variant="outline" className="gap-1">
                  <Trophy className="h-3 w-3" />
                  245 Reputation Points
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Active contributor since January 2024
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Files Uploaded</p>
                <p className="text-3xl font-bold" data-testid="text-uploads-count">12</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Downloads</p>
                <p className="text-3xl font-bold">1,456</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Download className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Reputation</p>
                <p className="text-3xl font-bold">245</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="uploads" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
            <TabsTrigger value="uploads" data-testid="tab-uploads">
              My Uploads
            </TabsTrigger>
            <TabsTrigger value="downloads" data-testid="tab-downloads">
              Downloaded
            </TabsTrigger>
          </TabsList>

          <TabsContent value="uploads" className="mt-6">
            {mockUploads.length > 0 ? (
              <div className="grid gap-4">
                {mockUploads.map((file) => (
                  <FileCard
                    key={file.id}
                    {...file}
                    onDownload={() => console.log("Download", file.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                imageSrc={emptyUploadsImg}
                title="No uploads yet"
                description="You haven't uploaded any files yet. Start sharing your study materials!"
                actionLabel="Upload File"
                onAction={() => console.log("Upload clicked")}
              />
            )}
          </TabsContent>

          <TabsContent value="downloads" className="mt-6">
            <EmptyState
              icon={Download}
              title="No downloads yet"
              description="Files you download will appear here for easy access."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
