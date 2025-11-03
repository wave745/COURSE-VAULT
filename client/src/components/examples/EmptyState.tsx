import { EmptyState } from "../EmptyState";
import { FolderOpen } from "lucide-react";
import emptyFolderImg from "@assets/generated_images/Empty_folder_illustration_576b343d.png";

export default function EmptyStateExample() {
  return (
    <div className="p-6 space-y-12">
      <EmptyState
        icon={FolderOpen}
        title="No files found"
        description="There are no files uploaded for this course yet. Be the first to contribute!"
        actionLabel="Upload File"
        onAction={() => console.log("Upload clicked")}
      />
      <EmptyState
        imageSrc={emptyFolderImg}
        title="No uploads yet"
        description="You haven't uploaded any files yet. Start sharing your notes and study materials with fellow students."
        actionLabel="Upload Your First File"
        onAction={() => console.log("Upload clicked")}
      />
    </div>
  );
}
