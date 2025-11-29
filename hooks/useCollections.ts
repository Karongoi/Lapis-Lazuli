"use client";

import { useState, useEffect, useCallback } from "react";

export function useCollection(collectionId?: number) {
    const isEditing = !!collectionId;

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const fetchCollection = useCallback(async () => {
        if (!collectionId) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/admin/collections/${collectionId}`);
            if (!res.ok) throw new Error("Failed to fetch");

            const { data } = await res.json();
            setData({
                name: data.name ?? "",
                theme: data.theme ?? "",
                description: data.description ?? "",
                launch_date: data.launch_date?.split("T")[0] ?? "",
                main_image_url: data.main_image_url ?? "",
                status: data.status ?? "upcoming",
                creative_notes: data.creative_notes ?? "",
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [collectionId]);

    const saveCollection = useCallback(
        async (payload: any) => {
            setSaving(true);
            setError(null);

            try {
                const url = isEditing
                    ? `/api/admin/collections/${collectionId}`
                    : `/api/admin/collections`;

                const method = isEditing ? "PATCH" : "POST";

                const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) throw new Error("Failed to save");

                return res.json();
            } catch (err: any) {
                setError(err.message);
                throw err;
            } finally {
                setSaving(false);
            }
        },
        [collectionId, isEditing]
    );

    useEffect(() => {
        if (isEditing) fetchCollection();
    }, [fetchCollection, isEditing]);

    return {
        data,
        saveCollection,
        loading,
        saving,
        error
    };
}
