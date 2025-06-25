"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Plus, Edit, Trash2, Eye, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useStore } from "@/lib/store"
import Image from "next/image"

const categories = [
  { value: "gaming-consoles", label: "Gaming Consoles" },
  { value: "graphics-cards", label: "Graphics Cards" },
  { value: "gaming-mice", label: "Gaming Mice" },
  { value: "gaming-keyboards", label: "Gaming Keyboards" },
  { value: "gaming-headsets", label: "Gaming Headsets" },
  { value: "gaming-monitors", label: "Gaming Monitors" },
  { value: "gaming-laptops", label: "Gaming Laptops" },
  { value: "gaming-chairs", label: "Gaming Chairs" },
  { value: "processors", label: "Processors" },
  { value: "gaming-accessories", label: "Gaming Accessories" },
  { value: "storage-memory", label: "Storage & Memory" },
]

const brands = [
  "Sony",
  "Microsoft",
  "Nintendo",
  "Valve",
  "NVIDIA",
  "AMD",
  "Intel",
  "Razer",
  "Logitech",
  "SteelSeries",
  "Corsair",
  "HyperX",
  "ASUS",
  "MSI",
  "Alienware",
  "LG",
  "Secretlab",
  "Herman Miller",
  "Elgato",
  "Blue",
  "Samsung",
]

export function ProductManagement() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    brand: "",
    stock: "",
    description: "",
    specifications: "",
    featured: false,
    image: "",
    images: [] as string[],
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        if (isEdit && editingProduct) {
          setEditingProduct({
            ...editingProduct,
            images: [...(editingProduct.images || []), imageUrl],
            image: editingProduct.image || imageUrl, // Set as main image if none exists
          })
        } else {
          setUploadedImages((prev) => [...prev, imageUrl])
          setNewProduct((prev) => ({
            ...prev,
            images: [...prev.images, imageUrl],
            image: prev.image || imageUrl, // Set as main image if none exists
          }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number, isEdit = false) => {
    if (isEdit && editingProduct) {
      const newImages = editingProduct.images.filter((_: any, i: number) => i !== index)
      setEditingProduct({
        ...editingProduct,
        images: newImages,
        image: newImages[0] || "", // Set first image as main or empty if no images
      })
    } else {
      const newImages = newProduct.images.filter((_, i) => i !== index)
      setUploadedImages(newImages)
      setNewProduct((prev) => ({
        ...prev,
        images: newImages,
        image: newImages[0] || "", // Set first image as main or empty if no images
      }))
    }
  }

  const setMainImage = (imageUrl: string, isEdit = false) => {
    if (isEdit && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        image: imageUrl,
      })
    } else {
      setNewProduct((prev) => ({
        ...prev,
        image: imageUrl,
      }))
    }
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert("Please fill in all required fields")
      return
    }

    const specifications = newProduct.specifications
      .split("\n")
      .filter((spec) => spec.trim())
      .map((spec) => spec.trim())

    const product = {
      name: newProduct.name,
      price: Number.parseFloat(newProduct.price),
      originalPrice: Number.parseFloat(newProduct.originalPrice) || Number.parseFloat(newProduct.price),
      discount:
        Math.round(
          ((Number.parseFloat(newProduct.originalPrice) - Number.parseFloat(newProduct.price)) /
            Number.parseFloat(newProduct.originalPrice)) *
            100,
        ) || 0,
      category: newProduct.category,
      brand: newProduct.brand,
      stockCount: Number.parseInt(newProduct.stock) || 0,
      inStock: Number.parseInt(newProduct.stock) > 0,
      description: newProduct.description,
      specifications,
      featured: newProduct.featured,
      image: newProduct.image || "/placeholder.svg?height=400&width=400",
      images:
        newProduct.images.length > 0
          ? newProduct.images
          : [newProduct.image || "/placeholder.svg?height=400&width=400"],
      rating: 4.5, // Default rating
      reviews: 0, // Default reviews
    }

    addProduct(product)

    // Reset form
    setNewProduct({
      name: "",
      price: "",
      originalPrice: "",
      category: "",
      brand: "",
      stock: "",
      description: "",
      specifications: "",
      featured: false,
      image: "",
      images: [],
    })
    setUploadedImages([])
    setIsAddDialogOpen(false)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct({
      ...product,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      stock: product.stockCount.toString(),
      specifications: product.specifications.join("\n"),
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateProduct = () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.category) {
      alert("Please fill in all required fields")
      return
    }

    const specifications = editingProduct.specifications
      .split("\n")
      .filter((spec: string) => spec.trim())
      .map((spec: string) => spec.trim())

    const updatedProduct = {
      name: editingProduct.name,
      price: Number.parseFloat(editingProduct.price),
      originalPrice: Number.parseFloat(editingProduct.originalPrice) || Number.parseFloat(editingProduct.price),
      discount:
        Math.round(
          ((Number.parseFloat(editingProduct.originalPrice) - Number.parseFloat(editingProduct.price)) /
            Number.parseFloat(editingProduct.originalPrice)) *
            100,
        ) || 0,
      category: editingProduct.category,
      brand: editingProduct.brand,
      stockCount: Number.parseInt(editingProduct.stock) || 0,
      inStock: Number.parseInt(editingProduct.stock) > 0,
      description: editingProduct.description,
      specifications,
      featured: editingProduct.featured,
      image: editingProduct.image,
      images: editingProduct.images,
    }

    updateProduct(editingProduct.id, updatedProduct)
    setIsEditDialogOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Select
                    value={newProduct.brand}
                    onValueChange={(value) => setNewProduct({ ...newProduct, brand: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Sale Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="specifications">Specifications (one per line)</Label>
                <Textarea
                  id="specifications"
                  value={newProduct.specifications}
                  onChange={(e) => setNewProduct({ ...newProduct, specifications: e.target.value })}
                  placeholder="Enter specifications, one per line"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={newProduct.featured}
                  onCheckedChange={(checked) => setNewProduct({ ...newProduct, featured: checked })}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>

              <div>
                <Label>Product Images</Label>
                <div className="space-y-4">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e)}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Images
                    </Button>
                  </div>

                  {newProduct.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {newProduct.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Product image ${index + 1}`}
                            width={100}
                            height={100}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setMainImage(image)}
                              className={`text-xs ${newProduct.image === image ? "bg-blue-500" : ""}`}
                            >
                              Main
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => removeImage(index)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={handleAddProduct} className="w-full">
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {categories.find((cat) => cat.value === product.category)?.label || product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.stockCount}</TableCell>
                  <TableCell>
                    <Badge variant={product.inStock ? "default" : "destructive"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                    {product.featured && (
                      <Badge variant="secondary" className="ml-1">
                        Featured
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Product Name *</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-brand">Brand</Label>
                  <Select
                    value={editingProduct.brand}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, brand: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-price">Sale Price *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-originalPrice">Original Price</Label>
                  <Input
                    id="edit-originalPrice"
                    type="number"
                    step="0.01"
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-stock">Stock Quantity</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select
                  value={editingProduct.category}
                  onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-specifications">Specifications (one per line)</Label>
                <Textarea
                  id="edit-specifications"
                  value={editingProduct.specifications}
                  onChange={(e) => setEditingProduct({ ...editingProduct, specifications: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-featured"
                  checked={editingProduct.featured}
                  onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, featured: checked })}
                />
                <Label htmlFor="edit-featured">Featured Product</Label>
              </div>

              <div>
                <Label>Product Images</Label>
                <div className="space-y-4">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, true)}
                      className="hidden"
                      id="edit-file-input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("edit-file-input")?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload More Images
                    </Button>
                  </div>

                  {editingProduct.images && editingProduct.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {editingProduct.images.map((image: string, index: number) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Product image ${index + 1}`}
                            width={100}
                            height={100}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setMainImage(image, true)}
                              className={`text-xs ${editingProduct.image === image ? "bg-blue-500" : ""}`}
                            >
                              Main
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => removeImage(index, true)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUpdateProduct} className="flex-1">
                  Update Product
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
