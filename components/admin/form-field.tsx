import type React from "react"
interface FormFieldProps {
    label: string
    error?: string
    required?: boolean
    children: React.ReactNode
}

export function FormField({ label, error, required, children }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium">
                {label}
                {required && <span className="text-destructive"> *</span>}
            </label>
            {children}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    )
}
