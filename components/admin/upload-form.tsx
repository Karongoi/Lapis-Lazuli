"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

interface CloudinaryUploadProps {
    folder?: string
    onUploadComplete: (url: string) => void
}

export function CloudinaryUpload({ folder, onUploadComplete }: CloudinaryUploadProps) {
    const [uploading, setUploading] = useState(false)

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!)
        if (folder) formData.append("folder", folder)

        try {
            const res = await fetch(
                `/api/admin/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            )

            const data = await res.json()
            onUploadComplete(data.secure_url) // ✅ returns uploaded URL
        } catch (err) {
            console.error("Upload failed", err)
            toast.error("Upload failed, please try again.")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
            <Button type="button" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
            </Button>
        </div>
    );
}
