"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/admin/form-field"
import LoadingSkeleton from "@/common/shared/loadingSkeleton"
import { CloudinaryUpload } from "./upload-form"
import { type CollectionForm, collectionSchema } from "@/schemas/collections"
import { useCollection } from "@/hooks/useCollections"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

export function CollectionForm({ collectionId }: { collectionId?: number }) {
    const router = useRouter();
    const isEditing = !!collectionId;

    const { data, loading, saving, error, saveCollection } =
        useCollection(collectionId);

    // RHF Setup
    const form = useForm<CollectionForm>({
        resolver: zodResolver(collectionSchema),
        defaultValues: {
            name: "",
            theme: "",
            description: "",
            launch_date: "",
            status: "upcoming",
            main_image_url: "",
            creative_notes: "",
        },
    });

    // Populate the form when data is loaded
    useEffect(() => {
        if (data) {
            form.reset(data);
        }
    }, [data, form]);

    async function onSubmit(values: CollectionForm) {
        const payload = {
            ...values,
            launch_date: values.launch_date
                ? new Date(values.launch_date)
                : null,
        };

        await saveCollection(payload);
        router.push("/admin/collections");
    }

    if (loading)
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <LoadingSkeleton />
            </div>
        )

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            <Card>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* IMAGE */}
                    <FormField
                        label="Collection Image"
                        className="col-span-1 md:col-span-2"
                        error={form.formState.errors.main_image_url?.message}
                    >
                        <div className="flex flex-col gap-3 md:gap-4 md:flex-row justify-between items-center">
                            {/* Image Preview */}
                            {form.watch("main_image_url") && (
                                <Image
                                    src={form.watch("main_image_url")}
                                    alt="Preview"
                                    width={400}
                                    height={300}
                                    className="rounded-md border object-contain w-full md:w-1/2 h-64"
                                />
                            )}

                            <div className="space-y-3 w-full md:w-1/2">
                                <CloudinaryUpload
                                    folder="collections"
                                    onUploadComplete={(url) =>
                                        form.setValue("main_image_url", url, { shouldValidate: true })
                                    }
                                />
                                <Input
                                    {...form.register("main_image_url")}
                                    placeholder="Image URL"
                                />
                            </div>
                        </div>
                    </FormField>

                    {/* NAME */}
                    <FormField
                        label="Name"
                        required
                        error={form.formState.errors.name?.message}
                    >
                        <Input {...form.register("name")} />
                    </FormField>

                    {/* THEME */}
                    <FormField label="Theme">
                        <Input {...form.register("theme")} />
                    </FormField>

                    {/* DESCRIPTION */}
                    <FormField label="Description" className="col-span-1 md:col-span-2">
                        <Textarea rows={3} {...form.register("description")} />
                    </FormField>

                    {/* LAUNCH DATE */}
                    <FormField label="Launch Date">
                        <Input type="date" {...form.register("launch_date")} />
                    </FormField>

                    {/* STATUS */}
                    <FormField label="Status">
                        <Select
                            {...form.register("status")}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>

                    {/* CREATIVE NOTES */}
                    <FormField label="Creative Notes" className="col-span-1 md:col-span-2">
                        <Textarea rows={4} {...form.register("creative_notes")} />
                    </FormField>

                </CardContent>
            </Card>

            <div className="flex gap-4 justify-between w-[90%] mx-auto my-4">
                <Button type="button" variant="outline" className="w-full max-w-60" size={"lg"} onClick={() => router.back()}>
                    Cancel
                </Button>

                <Button type="submit" className="w-full max-w-60" size={"lg"} disabled={saving}>
                    {saving ? "Saving..." : isEditing ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
}
