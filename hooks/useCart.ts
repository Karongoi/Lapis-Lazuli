"use client"

import { useAuth } from "@/context/AuthContext";
import { Cart } from "@/lib/types"
import { useEffect, useState } from "react"
import { useCallback } from "react"

export function useCart() {
    const { user } = useAuth();
    const [cart, setCart] = useState<Cart | null>(null)
    const [loading, setLoading] = useState(true)
    const [guestId, setGuestId] = useState<string>("")

    // Initialize guest ID from localStorage
    useEffect(() => {
        const storedGuestId = localStorage.getItem("guest_id")
        if (!storedGuestId) {
            const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            localStorage.setItem("guest_id", newGuestId)
            setGuestId(newGuestId)
        } else {
            setGuestId(storedGuestId)
        }
    }, [])

    // Fetch cart
    const fetchCart = useCallback(async () => {
        if (!guestId && !user?.id) return

        try {
            setLoading(true)
            const response = await fetch("/api/cart", {
                headers: {
                    "x-user-id": user?.id || "",
                    "x-guest-id": guestId || "",
                },
            })

            if (response.ok) {
                const data = await response.json()
                setCart(data.data)
            }
        } finally {
            setLoading(false)
        }
    }, [guestId, user?.id])

    // Add to cart
    const addItem = useCallback(
        async (variantId: number, quantity: number) => {
            try {
                const userId = user?.id
                const response = await fetch("/api/cart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-user-id": userId || "",
                        "x-guest-id": guestId,
                    },
                    body: JSON.stringify({ variantId, quantity }),
                })
                if (response.ok) {
                    const data = await response.json()
                    setCart(data.data)
                }
            } catch (error) {
                console.error("Failed to add to cart:", error)
            }
        },
        [guestId],
    )

    // Update item quantity
    const updateItem = useCallback(async (itemId: number, quantity: number) => {
        try {
            const response = await fetch(`/api/cart/${itemId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantity }),
            })
            if (response.ok) {
                const data = await response.json()
                console.log('updateItem data', data)
                setCart(data.data)
            }
        } catch (error) {
            console.error("Failed to update cart item:", error)
        }
    }, [])

    // Remove item
    const removeItem = useCallback(
        async (itemId: number) => {
            try {
                const response = await fetch(`/api/cart/${itemId}`, {
                    method: "DELETE",
                })
                if (response.ok) {
                    await fetchCart()
                }
            } catch (error) {
                console.error("Failed to remove cart item:", error)
            }
        },
        [fetchCart],
    )

    // Migrate cart on login
    const migrateCart = useCallback(async (userId: string) => {
        try {
            await fetch("/api/cart/migrate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ guestId, userId }),
            })

            // clear guest ID after successful merge
            localStorage.removeItem("guest_id")
            setGuestId("")  // so future requests use userId only

            // refetch cart now as user cart
            await fetchCart()
        } catch (error) {
            console.error("Failed to migrate cart:", error)
        }
    }, [guestId, fetchCart])

    useEffect(() => {
        if (guestId) {
            fetchCart()
        }
    }, [guestId, fetchCart])

    useEffect(() => {
        if (user && !guestId) return // already migrated

        if (user?.id && guestId) {
            migrateCart(user.id)
        }
    }, [user?.id, guestId])

    return {
        cart,
        loading,
        addItem,
        updateItem,
        removeItem,
        migrateCart,
        refetch: fetchCart,
    }
}
