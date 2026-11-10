"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu } from "@/db/schema";

// The size the menu page is rendered at before being scaled down
const PAGE_W = 1280;
const PAGE_H = 800;

export default function MenuCard(menu: Menu) {
    const previewRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.25);

    useEffect(() => {
        const el = previewRef.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => {
            setScale(entry.contentRect.width / PAGE_W);
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <Link
            href={`/menus/${menu.id}`}
            className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10"
        >
            {/* Scaled live preview of /menus/[id] */}
            <div
                ref={previewRef}
                className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100"
            >
                <iframe
                    src={`/menus/${menu.id}`}
                    title={`Preview of ${menu.name}`}
                    loading="lazy"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-white"
                    style={{
                        width: PAGE_W,
                        height: PAGE_H,
                        transform: `scale(${scale})`,
                    }}
                />
            </div>

            {/* Name bar */}
            <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-4">
                <h3 className="truncate text-base font-semibold text-neutral-900">
                    {menu.name}
                </h3>
                <span className="ml-3 flex items-center gap-1 text-sm font-medium text-neutral-400 transition group-hover:text-neutral-900">
                    Open
                    <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4 transition group-hover:translate-x-0.5">
                        <path
                            fillRule="evenodd"
                            d="M3 10a.75.75 0 0 1 .75-.75h10.69l-3.22-3.22a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H3.75A.75.75 0 0 1 3 10Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </span>
            </div>
        </Link>
    );
}