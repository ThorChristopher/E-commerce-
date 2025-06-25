"use client"

import type React from "react"

import { useState } from "react"
import { Star, ThumbsUp, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

interface ReviewSectionProps {
  productId: string
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const { reviews, addReview } = useStore()
  const [newReview, setNewReview] = useState({
    comment: "",
    rating: 5,
    userName: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const productReviews = reviews.filter((review) => review.productId === productId)

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReview.comment.trim() || !newReview.userName.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    try {
      addReview({
        productId,
        user: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment,
        verified: true,
      })

      toast.success("Review submitted successfully!")
      setNewReview({ comment: "", rating: 5, userName: "" })
    } catch (error) {
      toast.error("Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Write a Review */}
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <Label htmlFor="userName">Your Name</Label>
              <Input
                id="userName"
                value={newReview.userName}
                onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <Label>Rating</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= newReview.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="review">Your Review</Label>
              <Textarea
                id="review"
                placeholder="Share your experience with this product..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="mt-2 min-h-[120px]"
                required
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Reviews */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Customer Reviews ({productReviews.length})</h3>

        {productReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {productReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>{review.user.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{review.user}</span>
                          {review.verified && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-muted-foreground leading-relaxed">{review.comment}</p>

                      <div className="flex items-center gap-4 pt-2">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful ({review.helpful})
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
