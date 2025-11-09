"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";

import { CartIcon } from "@/components/ui/cart";
import { HeartIcon } from "@/components/ui/heart";
import { UserIcon } from "@/components/ui/user";
import { SearchIcon } from "@/components/ui/search";
import { NavDropdown } from "@/components/navbar-dropdown";
import { SearchPopup } from "./search-popup";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/context/AuthContext";
import {
    buildCategoriesMenu,
    buildSectionsMenu,
    CATEGORIES,
    formatCollectionSlug,
    GENDERS,
} from "@/lib/constants";
import { useFetchCollections } from "@/hooks/useStore";
import { Collection } from "@/lib/types";

function buildCollectionsMenu(collections: Collection[] = []) {
    return collections.map((collection) => {
        const slug = formatCollectionSlug(collection.name);
        return {
            label: collection.name,
            href: `/collections/${slug}`,
            items: CATEGORIES.map((category) => ({
                label: category,
                href: `/collections/${slug}/${category.toLowerCase().replace(/\s+/g, "-")}`,
                items: GENDERS.map((gender) => ({
                    label: gender,
                    href: `/collections/${slug}/${category.toLowerCase().replace(/\s+/g, "-")}/${gender.toLowerCase()}`,
                })),
            })),
        };
    });
}

export default function Navbar() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const queryClient = useQueryClient();
    const { collections = [] } = useFetchCollections();
    const collectionsMenuItems = buildCollectionsMenu(collections);
    const shopMenuItems = buildCategoriesMenu();

    // Build gender-based menus
    const menMenuItems = buildSectionsMenu("men")
    const womenMenuItems = buildSectionsMenu("women")
    const kidsMenuItems = buildSectionsMenu("kids")
    return (
        <header className="relative z-50 w-full font-jost bg-background border-b border-gray-200">
            <div className="flex items-center justify-between gap-4 p-4 md:px-8">
                {/* Left: Logo */}
                <Link href="/home" className="flex-shrink-0">
                    <Image
                        className="dark:invert"
                        src="/logo.png"
                        alt="Lapis Lazuli Threads Logo"
                        width={160}
                        height={38}
                    />
                </Link>

                {/* Middle: Desktop Menu */}
                <nav className="hidden md:block bg-primary/10 px-6 py-2 rounded-full">
                    <ul className="flex gap-8 text-sm items-center">
                        <li>
                            <NavDropdown label="Shop" items={shopMenuItems} />
                        </li>

                        {/* <li>
                            <NavDropdown label="Men" items={menMenuItems} />
                        </li>
                        <li>
                            <NavDropdown label="Women" items={womenMenuItems} />
                        </li>
                        <li>
                            <NavDropdown label="Kids" items={kidsMenuItems} />
                        </li> */}
                        <li>
                            <NavDropdown label="Collections" items={collectionsMenuItems} />
                        </li>
                        <li className="uppercase">
                            <Link href="/our-story">Our Story</Link>
                        </li>
                    </ul>
                </nav>

                {/* Right: Icons */}
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        aria-label="Search"
                        className="hover:text-secondary cursor-pointer transition-colors"
                    >
                        <SearchIcon />
                    </button>
                    <Link className="hover:text-secondary" href="/favorites">
                        <HeartIcon />
                    </Link>
                    <Link className="hover:text-secondary" href="/cart">
                        <CartIcon />
                    </Link>

                    {/* Profile dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                                <AvatarFallback>
                                    {user?.user_metadata?.full_name?.[0] || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                {user?.user_metadata?.full_name || user?.email || "Anonymous"}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push("/account")}>
                                <UserIcon /> Account
                            </DropdownMenuItem>
                            {user ? (
                                <DropdownMenuItem
                                    onClick={async () => {
                                        queryClient.clear();
                                        await signOut();
                                    }}
                                >
                                    Logout
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={() => router.push("/login")}>
                                    Login
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 rounded hover:bg-gray-100"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                    >
                        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-white/90 backdrop-blur-lg w-1/2 ml-auto flex flex-col justify-start items-start gap-8 text-lg font-medium text-gray-800 animate-in fade-in slide-in-from-top duration-300 md:hidden">
                    <button
                        className="absolute top-6 right-6 p-2 rounded-full bg-gray-200/60 hover:bg-gray-300"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <X size={24} />
                    </button>
                    <ul className="flex flex-col w-full gap-4 text-sm px-4 pt-20">
                        <li>
                            <NavDropdown label="Shop" items={shopMenuItems} />
                        </li>
                        <li>
                            <NavDropdown label="Collections" items={collectionsMenuItems} />
                        </li>
                        <li className="uppercase">
                            <Link href="/our-story" onClick={() => setIsMenuOpen(false)}>
                                Our Story
                            </Link>
                        </li>
                    </ul>
                </div>
            )}

            {/* Search Popup */}
            <SearchPopup
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </header>
    );
}
