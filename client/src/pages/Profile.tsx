import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCard } from "@/components/FileCard";
import { EmptyState } from "@/components/EmptyState";
import { Trophy, Upload, Download, TrendingUp, LogOut } from "lucide-react";
import emptyUploadsImg from "@assets/generated_images/No_uploads_illustration_ff0e0389.png";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type User } from "@shared/schema";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: user, isLoading } = useQuery<Partial<User>>({
    queryKey: ["/api/auth/me"],
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      setLocation("/login");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 py-8">
          <Card className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  const initials = user.displayName
    ? user.displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const mockUploads: any[] = [];
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-8">
        <Card className="p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2" data-testid="text-profile-name">
                {user.displayName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary" className="font-mono">{user.vaultId}</Badge>
                <Badge variant="outline" className="gap-1">
                  <Trophy className="h-3 w-3" />
                  {user.reputation} Reputation Points
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Active contributor since {new Date(user.createdAt!).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              {logoutMutation.isPending ? "Logging out..." : "Log Out"}
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Files Uploaded</p>
                <p className="text-3xl font-bold" data-testid="text-uploads-count">0</p>
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
                <p className="text-3xl font-bold">0</p>
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
                <p className="text-3xl font-bold" data-testid="text-reputation">{user.reputation}</p>
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
