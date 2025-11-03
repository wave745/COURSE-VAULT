import { FileCard } from "../FileCard";

export default function FileCardExample() {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="flex flex-col gap-4 p-6 max-w-4xl">
      <FileCard
        id="1"
        title="CSC201 Lecture Notes - Introduction to Python Programming.pdf"
        type="pdf"
        uploadedBy="John Doe"
        uploadedAt={twoDaysAgo}
        downloadCount={145}
        verified={true}
        onDownload={() => console.log("Download file 1")}
      />
      <FileCard
        id="2"
        title="Data Structures Flowchart.png"
        type="image"
        uploadedBy="Jane Smith"
        uploadedAt={weekAgo}
        downloadCount={89}
        onDownload={() => console.log("Download file 2")}
      />
      <FileCard
        id="3"
        title="Final Exam Study Guide.docx"
        type="docx"
        uploadedBy="Mike Johnson"
        uploadedAt={new Date(now.getTime() - 12 * 60 * 60 * 1000)}
        downloadCount={234}
        verified={true}
        onDownload={() => console.log("Download file 3")}
      />
    </div>
  );
}
