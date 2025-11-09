"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react"

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
    const [isMobile, setIsMobile] = useState(false)

    // detect mobile vs desktop
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const currentSubitems =
        hoveredItem && items.find((item) => item.label === hoveredItem)?.items
            ? items.find((item) => item.label === hoveredItem)?.items || []
            : []

    // ---------- DESKTOP VIEW ----------
    if (!isMobile) {
        return (
            <div
                className="relative group"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => {
                    setIsOpen(false)
                    setHoveredItem(null)
                }}
            >
                <button className="uppercase flex items-center gap-1 hover:text-secondary transition-colors">
                    {label}
                    <ChevronDown className="w-4 h-4" />
                </button>

                {isOpen && (
                    <div className="absolute left-0 mt-0 bg-card z-50 flex">
                        {/* Left column */}
                        <div className="w-48 py-2 border-r border-border">
                            {items.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href || "#"}
                                    onMouseEnter={() =>
                                        item.items?.length ? setHoveredItem(item.label) : null
                                    }
                                    className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between transition-colors ${hoveredItem === item.label
                                            ? "bg-muted text-foreground"
                                            : "hover:bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {item.label}
                                    {item.items && item.items.length > 0 && (
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Right column */}
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

    // ---------- MOBILE VIEW ----------
    return (
        <div className="w-full text-center">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full flex items-center justify-between py-3 border-b border-border uppercase font-medium"
            >
                {label}
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
            </button>

            {isOpen && (
                <div className="flex flex-col bg-card/70 border-b border-border text-left">
                    {items.map((item) => (
                        <div key={item.label} className="flex flex-col">
                            {item.items && item.items.length > 0 ? (
                                <details className="group">
                                    <summary className="cursor-pointer list-none flex items-center justify-between px-4 py-2 text-sm text-foreground hover:bg-muted transition">
                                        {item.label}
                                        <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                                    </summary>
                                    <div className="pl-6 pb-2">
                                        {item.items.map((sub) => (
                                            <Link
                                                key={sub.label}
                                                href={sub.href || "#"}
                                                className="block py-1 text-sm text-muted-foreground hover:text-foreground transition"
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                </details>
                            ) : (
                                <Link
                                    href={item.href || "#"}
                                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
