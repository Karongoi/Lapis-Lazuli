import Image from "next/image"
import Link from "next/link"
import { CartIcon } from "@/components/ui/cart"
import { HeartIcon } from "@/components/ui/heart"
import { UserIcon } from "@/components/ui/user"
import { SearchIcon } from "@/components/ui/search"
import { NavDropdown } from "@/components/navbar-dropdown"
import { useState } from "react"
import { SearchPopup } from "./search-popup"

const shopMenuItems = [
    {
        label: "Men",
        items: [
            { label: "Shirts", href: "/shop/men?q=${encodeURIComponent(searchQuery)}" },
            { label: "Pants", href: "/shop/men/pants" },
            { label: "Accessories", href: "/shop/men/accessories" },
        ],
        href: "/shop/men",
    },
    {
        label: "Women",
        items: [
            { label: "Dresses", href: "/shop/women/dresses" },
            { label: "Tops", href: "/shop/women/tops" },
            { label: "Accessories", href: "/shop/women/accessories" },
        ],
        href: "/shop/women",
    },
    {
        label: "Unisex",
        items: [
            { label: "Hoodies", href: "/shop/unisex/hoodies" },
            { label: "T-Shirts", href: "/shop/unisex/tshirts" },
            { label: "Accessories", href: "/shop/unisex/accessories" },
        ],
        href: "/shop/unisex",
    },
]

const collectionsMenuItems = [
    {
        label: "Imani Collection",
        items: [
            { label: "Men", href: "/shop/collections/men" },
            { label: "Women", href: "/shop/collections/women" },
            { label: "Unisex", href: "/shop/collections/unisex" },
        ],
        href: "/collections/imani",
    },
    {
        label: "Heritage Collection",
        href: "/collections/heritage",
    },
    {
        label: "Modern Collection",
        href: "/collections/modern",
    },
    {
        label: "Limited Edition",
        href: "/collections/limited",
    },
]

export default function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    return (
        <div className="w-full flex items-center justify-between gap-8 p-4 md:px-8 font-jost">
            {/* Logo */}
            <Link href="/home">
                <Image className="dark:invert" src="/logo.png" alt="Lapis Lazuli Threads Logo" width={180} height={38} />
            </Link>
            {/* Menu */}
            <nav className="bg-primary/50 px-8 py-2 rounded-full">
                <ul className="flex gap-8 text-sm">
                    <li>
                        <NavDropdown label="Shop" items={shopMenuItems} />
                    </li>
                    <li>
                        <NavDropdown label="Collections" items={collectionsMenuItems} />
                    </li>
                    <li className="uppercase">
                        <a href="/our-story">Our Story</a>
                    </li>
                </ul>
            </nav>
            {/* Account Menu: search, fav, cart */}
            <div className="flex gap-4">
                <button
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Search"
                    className="hover:text-secondary cursor-pointer transition-colors"
                >
                    <SearchIcon />
                </button>
                <Link className="hover:text-secondary" href="/favorites">
                    {" "}
                    <HeartIcon />
                </Link>
                <Link className="hover:text-secondary" href="/cart">
                    {" "}
                    <CartIcon />{" "}
                </Link>
                <Link className="hover:text-secondary" href="/account">
                    {" "}
                    <UserIcon />
                </Link>
            </div>

            <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    )
}
