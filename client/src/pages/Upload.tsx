import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload as UploadIcon, FileText, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const departments = [
  "Computer Science & Information Technology",
  "Law",
  "Medicine & Surgery",
  "Engineering",
  "Business Management",
];

const levels = ["100", "200", "300", "400", "500", "600"];

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Upload submitted");
    toast({
      title: "Upload successful",
      description: "Your file has been uploaded and is pending verification.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Upload Course Material</h1>
          <p className="text-muted-foreground">
            Share your notes, assignments, or study materials with fellow students
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select required>
                <SelectTrigger id="department" data-testid="select-department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <Select required>
                  <SelectTrigger id="level" data-testid="select-level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}L
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course-code">Course Code *</Label>
                <Input
                  id="course-code"
                  placeholder="e.g., CSC201"
                  required
                  data-testid="input-course-code"
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">File Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Lecture Notes - Week 5"
                required
                data-testid="input-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the file content..."
                rows={3}
                data-testid="input-description"
              />
            </div>

            <div className="space-y-2">
              <Label>File Upload *</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-between gap-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                      <div className="min-w-0 text-left">
                        <p className="font-medium truncate">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedFile(null)}
                      data-testid="button-remove-file"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-base mb-2">
                      Drag and drop your file here, or{" "}
                      <label className="text-primary hover:underline cursor-pointer">
                        browse
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileSelect}
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          data-testid="input-file"
                        />
                      </label>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: PDF, DOC, DOCX, PNG, JPG (Max 10MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" data-testid="button-submit-upload">
                Upload File
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
