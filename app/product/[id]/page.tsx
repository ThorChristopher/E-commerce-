"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, Heart, Share2, ShieldCheck, Truck, RotateCcw, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewSection } from "@/components/review-section"
import { AddToCartForm } from "@/components/add-to-cart-form"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

export default function ProductPage({ params }: { params: { id: string } }) {
  const { products } = useStore()
  const [selectedImage, setSelectedImage] = useState(0)

  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href)
        toast.success("Product link copied to clipboard!")
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Product link copied to clipboard!")
    }
  }

  const discountAmount = product.originalPrice - product.price
  const discountPercentage = Math.round((discountAmount / product.originalPrice) * 100)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/" className="text-muted-foreground hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="text-muted-foreground hover:text-primary">
          Products
        </Link>
        <span>/</span>
        <span className="font-medium">{product.name}</span>
      </div>

      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/products">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </Button>

      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square">
            <img
              src={product.images?.[selectedImage] || product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
            {product.discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-lg px-3 py-1">-{discountPercentage}% OFF</Badge>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? "border-primary" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">
              {product.category.replace("-", " ").toUpperCase()}
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-2xl text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {product.originalPrice > product.price && (
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  Save ${discountAmount.toFixed(2)} ({discountPercentage}% OFF)
                </Badge>
              </div>
            )}
          </div>

          <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4">
            <span className="font-medium">Availability:</span>
            <Badge variant={product.inStock ? "default" : "destructive"}>
              {product.inStock ? `${product.stockCount} in stock` : "Out of stock"}
            </Badge>
          </div>

          <AddToCartForm product={product} />

          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="flex-1">
              <Heart className="h-4 w-4 mr-2" />
              Add to Wishlist
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">Secure Payment</p>
            </div>
            <div className="text-center">
              <Truck className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Free Shipping $100+</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">30-Day Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-lg leading-relaxed">{product.description}</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Key Features</h3>
              <ul className="space-y-2">
                <li>• Premium build quality with industry-leading components</li>
                <li>• Optimized for high-performance gaming and professional use</li>
                <li>• Compatible with latest gaming titles and software</li>
                <li>• Backed by manufacturer warranty and our quality guarantee</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {product.specifications.map((spec, index) => {
                  const [key, value] = spec.split(": ")
                  return (
                    <div key={index} className="flex justify-between py-3 border-b last:border-b-0">
                      <span className="font-medium text-muted-foreground">{key}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ReviewSection productId={product.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
