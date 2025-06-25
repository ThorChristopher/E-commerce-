"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  return (
    <div className="flex w-full max-w-md">
      <Input type="search" placeholder="Search gaming products..." className="rounded-r-none" />
      <Button type="submit" className="rounded-l-none">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
}
