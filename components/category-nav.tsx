import { Button } from "@/components/ui/button"

const categories = [
  "All Products",
  "Gaming PCs",
  "Graphics Cards",
  "Gaming Keyboards",
  "Gaming Mice",
  "Headsets",
  "Monitors",
  "Accessories",
]

export function CategoryNav() {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Button key={category} variant="outline" className="whitespace-nowrap">
          {category}
        </Button>
      ))}
    </nav>
  )
}
