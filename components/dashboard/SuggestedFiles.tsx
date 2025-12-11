import { FileIcon, FolderIcon } from "lucide-react"

const suggestedItems = [
  { type: "file", name: "Project Proposal.docx", icon: FileIcon },
  { type: "folder", name: "Client Documents", icon: FolderIcon },
  { type: "file", name: "Budget 2023.xlsx", icon: FileIcon },
]

export default function SuggestedFiles() {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Suggested</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {suggestedItems.map((item) => (
          <div
            key={item.name}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg flex items-center space-x-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <item.icon className="h-8 w-8 text-[rgb(31,111,130)]" />
            <span className="font-medium truncate text-gray-700 dark:text-gray-300">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

