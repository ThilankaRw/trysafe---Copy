"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SearchBar() {
  const [query, setQuery] = useState("")

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        type="search"
        placeholder="Search Drive..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-4 py-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full border-none focus:ring-2 focus:ring-[rgb(31,111,130)]"
      />
    </div>
  )
}

