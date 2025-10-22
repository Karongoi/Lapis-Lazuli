"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"

interface DropdownItem {
    label: string
    href?: string
    items?: DropdownItem[]
}

interface NavDropdownProps {
    label: string
    items: DropdownItem[]
}

export function NavDropdown({ label, items }: NavDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)

    const handleMouseEnter = () => {
        setIsOpen(true)
        const firstItemWithSubitems = items.find((item) => item.items && item.items.length > 0)
        if (firstItemWithSubitems) {
            setHoveredItem(firstItemWithSubitems.label)
        }
    }

    const handleMouseLeave = () => {
        setIsOpen(false)
        setHoveredItem(null)
    }

    const currentSubitems = hoveredItem ? items.find((item) => item.label === hoveredItem)?.items || [] : []

    return (
        <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button className="uppercase flex items-center gap-1 hover:text-secondary transition-colors">
                {label}
                <ChevronDown className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-0 w-auto bg-card border border-border rounded-md shadow-sm z-50 flex">
                    {/* Left column: Main menu items */}
                    <div className="w-48 py-2 border-r border-border">
                        {items.map((item) => (
                            <button
                                key={item.label}
                                onMouseEnter={() => {
                                    if (item.items && item.items.length > 0) {
                                        setHoveredItem(item.label)
                                    }
                                }}
                                className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center justify-between ${hoveredItem === item.label ? "bg-muted text-foreground" : "hover:bg-muted text-muted-foreground"
                                    }`}
                            >
                                {item.label}
                                {item.items && item.items.length > 0 && <ChevronRight className="w-4 h-4 ml-2" />}
                            </button>
                        ))}
                    </div>

                    {/* Right column: Subitems for hovered item */}
                    {currentSubitems.length > 0 && (
                        <div className="w-56 py-2 px-4">
                            <div className="space-y-1">
                                {currentSubitems.map((subitem) => (
                                    <Link
                                        key={subitem.label}
                                        href={subitem.href || "#"}
                                        className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                                    >
                                        {subitem.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
