import WelcomeMessage from "./WelcomeMessage";
import FileGrid from "./FileGrid";
import UploadSection from "./UploadSection";
import { Skeleton } from "@/components/ui/skeleton";

// Define the type for the file data (should match Dashboard.tsx)
type FileData = {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  encrypted: boolean;
};

// Define props for MainContent
interface MainContentProps {
  files: FileData[];
  isLoading: boolean;
  onFileDelete: (fileId: string) => void;
}

// Accept props here
export default function MainContent({
  files,
  isLoading,
  onFileDelete,
}: MainContentProps) {
  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
      <WelcomeMessage />
      <UploadSection />

      {/* Handle loading state and pass props to FileGrid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : (
        <FileGrid files={files} onFileDelete={onFileDelete} />
      )}
    </main>
  );
}
