// hooks/useOrders.ts
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

// Fetch all orders for a user
const fetchUserOrders = async (userId: string): Promise<Order[]> => {
    const res = await fetch("/api/users/orders", {
        headers: { "x-user-id": userId },
    });

    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
};

// Fetch single order by ID
const fetchOrderById = async (id: string): Promise<Order> => {
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) throw new Error("Failed to fetch order");
    return res.json();
};

// Hook for user orders
export const useUserOrders = () => {
    const { user } = useAuth();
    const userId = user?.id;

    return useQuery<Order[], Error>({
        queryKey: ["userOrders", userId],
        queryFn: () => fetchUserOrders(userId!),
        enabled: !!userId, // only fetch when user is available
        staleTime: 1000 * 60 * 5,
    });
};

// Hook for single order
export const useOrder = (orderId: string) => {
    return useQuery<Order, Error>({
        queryKey: ["order", orderId],
        queryFn: () => fetchOrderById(orderId),
        enabled: !!orderId,
    });
};
