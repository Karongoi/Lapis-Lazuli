"use client"

import { useState } from "react"
import { useReviews } from "@/hooks/useReviews"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface ReviewsSectionProps {
    productId: number
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
    const { data, loading, submitting, addReview } = useReviews(productId)
    const [showForm, setShowForm] = useState(false)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")

    const handleSubmitReview = async () => {
        try {
            await addReview(rating, comment)
            setComment("")
            setRating(5)
            setShowForm(false)
        } catch (error: any) {
            alert(`Failed to submit review. Please log in first. ${error}`)
        }
    }

    if (loading) return <div>Loading reviews...</div>

    return (
        <section className="py-8 border-t">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Reviews</h2>
                {data && (
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.round(data.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">
                            {data.averageRating.toFixed(1)} ({data.count} reviews)
                        </span>
                    </div>
                )}
            </div>

            {!showForm && (
                <Button onClick={() => setShowForm(true)} variant="outline" className="mb-6">
                    Write a Review
                </Button>
            )}

            {showForm && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => setRating(star)} className="p-2">
                                    <Star className={`h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Comment</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-3 border rounded-lg resize-none"
                            rows={4}
                            placeholder="Share your experience..."
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={handleSubmitReview} disabled={submitting} className="flex-1 max-w-[400px] mx-auto">
                            {submitting ? "Submitting..." : "Submit Review"}
                        </Button>
                        <Button onClick={() => setShowForm(false)} variant="outline" disabled={submitting}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {data?.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <p className="font-medium">{review.author.full_name}</p>
                                <p className="text-sm text-gray-600">{review.author.email}</p>
                            </div>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                        </div>
                        {review.comment && <p className="text-sm">{review.comment}</p>}
                        <p className="text-xs text-gray-500 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                ))}
                {data && data.count === 0 && (
                    <p className="text-sm text-gray-600">No reviews yet. Be the first to review this product!</p>
                )}
            </div>
        </section>
    )
}
