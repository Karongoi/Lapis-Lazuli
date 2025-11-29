import { cn } from "@/lib/utils"
import type React from "react"
interface FormFieldProps {
    className?: string
    label: string
    error?: string
    required?: boolean
    children: React.ReactNode
}

export function FormField({ className, label, error, required, children }: FormFieldProps) {
    return (
        <div className={cn("flex flex-col space-y-1", className)}>
            <label className="block text-sm font-medium">
                {label}
                {required && <span className="text-destructive"> *</span>}
            </label>
            {children}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    )
}
