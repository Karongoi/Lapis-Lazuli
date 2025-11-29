"use client"

import type { BillingDetails } from "@/lib/types"

export type RetryOrderPayload = {
    orderId: number
    billingDetails: BillingDetails
    promotionCode?: string
    paymentMethod: "mpesa" | "card"
    savedAt: number
}

const STORAGE_PREFIX = "lapis:retry-order:"

const getKey = (orderId: number) => `${STORAGE_PREFIX}${orderId}`

export function saveRetryOrder(payload: RetryOrderPayload) {
    if (typeof window === "undefined") return
    try {
        localStorage.setItem(getKey(payload.orderId), JSON.stringify(payload))
    } catch (error) {
        console.error("Failed to persist retry order payload", error)
    }
}

export function getRetryOrder(orderId: string): RetryOrderPayload | null {
    if (typeof window === "undefined") return null
    try {
        const raw = localStorage.getItem(getKey(Number(orderId)))
        if (!raw) return null
        return JSON.parse(raw) as RetryOrderPayload
    } catch (error) {
        console.error("Failed to load retry order payload", error)
        return null
    }
}

export function removeRetryOrder(orderId: number) {
    if (typeof window === "undefined") return
    localStorage.removeItem(getKey(orderId))
}

