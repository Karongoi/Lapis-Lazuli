"use client"

import { useAuth } from "@/context/AuthContext";
import { ReviewsData } from "@/lib/types"
import { useState, useCallback, useEffect } from "react"

export function useReviews(productId: number) {
    const { user } = useAuth();
    const [data, setData] = useState<ReviewsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    // Fetch reviews
    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/reviews?productId=${productId}`)
            if (response.ok) {
                const result = await response.json()
                setData(result.data)
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error)
        } finally {
            setLoading(false)
        }
    }, [productId])

    // Create review
    const addReview = useCallback(
        async (rating: number, comment: string) => {
            try {
                setSubmitting(true)
                const userId = user?.id;

                if (!userId) {
                    throw new Error("Authentication required")
                }

                const response = await fetch("/api/reviews", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-user-id": userId,
                    },
                    body: JSON.stringify({
                        productId,
                        rating,
                        comment,
                    }),
                })

                if (response.ok) {
                    await fetchReviews()
                }
            } catch (error) {
                console.error("Failed to add review:", error)
                throw error
            } finally {
                setSubmitting(false)
            }
        },
        [productId, fetchReviews],
    )

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    return { data, loading, submitting, addReview, refetch: fetchReviews }
}
