"use client"

import Link from "next/link"
import { Slash } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
    className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn("z-10 flex items-center gap-2 mb-2", className)}>
            <ol className="flex items-center gap-2">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1

                    return (
                        <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                            {index > 0 && <hr className="h-4 w-0.25 rotate-12 bg-muted-foreground mx-1" />}
                            {item.href && !isLast ? (
                                <Link
                                    href={item.href}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={cn("text-sm", isLast ? "text-foreground font-medium" : "text-muted-foreground")}>
                                    {item.label}
                                </span>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
