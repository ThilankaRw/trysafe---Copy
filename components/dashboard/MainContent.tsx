import WelcomeMessage from "./WelcomeMessage";
import SuggestedFiles from "./SuggestedFiles";
import { FileGrid } from "./FileGrid";
import { DragDropFileBox } from "./DragDropFileBox";

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

export default function MainContent({
  files,
  isLoading,
  onFileDelete,
}: MainContentProps) {
  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
      <WelcomeMessage />
      <DragDropFileBox />
      <SuggestedFiles />
      <FileGrid files={files} onFileDelete={onFileDelete} />
    </main>
  );
}
