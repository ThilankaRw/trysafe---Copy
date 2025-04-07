import WelcomeMessage from "./WelcomeMessage"
import SuggestedFiles from "./SuggestedFiles"
import FileGrid from "./FileGrid"
import { DragDropFileBox } from "./DragDropFileBox"

export default function MainContent() {
  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
      <WelcomeMessage />
      <DragDropFileBox />
      <SuggestedFiles />
      <FileGrid />
    </main>
  )
}

