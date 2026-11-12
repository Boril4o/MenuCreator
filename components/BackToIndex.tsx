"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BackToIndex() {
    const pathname = usePathname();

    // The index page is the destination, so no button there.
    if (pathname === "/") return null;

    return (
        <Link
            href="/"
            aria-label="Back to all menus"
            className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
            <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
            </svg>
            Menus
        </Link>
    );
}