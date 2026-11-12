"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {uploadMenuFiles} from "@/app/actions";
import { useRouter } from 'next/navigation';
import {verifyFile} from "@/utils/helperFunctions";
import {AppError} from "@/types/AppError";

type Item = { id: string; file: File; url: string };

export default function CreateMenuPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const itemsRef = useRef<Item[]>([]);
    const router = useRouter();
    itemsRef.current = items;

    // Free object URLs when leaving the page
    useEffect(() => {
        return () => itemsRef.current.forEach((i) => URL.revokeObjectURL(i.url));
    }, []);

    const addFiles = useCallback((list: FileList | File[]) => {
        const images = Array.from(list).filter((f) => {
            try {
                verifyFile(f);
                return true;
            }
            catch (error) {
                if (error instanceof AppError) {
                    setError(error.message);
                }

                return false;
            }
        });

        if (images.length === 0) {
            return;
        }

        setError(null);
        setItems((prev) => {
            const known = new Set(
                prev.map((i) => `${i.file.name}-${i.file.size}-${i.file.lastModified}`)
            );
            const fresh = images
                .filter((f) => !known.has(`${f.name}-${f.size}-${f.lastModified}`))
                .map((file) => ({
                    id: crypto.randomUUID(),
                    file,
                    url: URL.createObjectURL(file),
                }));
            return [...prev, ...fresh];
        });
    }, []);

    const removeItem = (id: string) => {
        setItems((prev) => {
            const target = prev.find((i) => i.id === id);
            if (target) URL.revokeObjectURL(target.url);
            return prev.filter((i) => i.id !== id);
        });
    };

    const clearAll = () => {
        items.forEach((i) => URL.revokeObjectURL(i.url));
        setItems([]);
    };

    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (items.length === 0 || isSubmitting) return;
        setIsSubmitting(true);
        setError(null);

        const res = await uploadMenuFiles(items.map((i) => i.file));

        if (!res.success){
            setError(res.message);
            setIsSubmitting(false);
            return;
        }

        const menuId = res.data;
        setIsSubmitting(false);

        router.push(`/menus/${menuId}`);
    };

    return (
        <main className="min-h-screen bg-[linear-gradient(to_bottom,#fafafa_0%,#fafafa_50%,#ffffff_52%,#d9d9db_70%,#6b6b70_100%)] px-4 pb-20 pt-16 font-sans text-neutral-900 sm:px-6 sm:pb-[120px] sm:pt-24">
            <header className="mx-auto mb-[72px] max-w-[640px] text-center">
                <h1 className="m-0 text-[clamp(2.6rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
                    Create Menu
                </h1>
                <p className="mt-5 text-xl leading-relaxed text-neutral-500">
                    Select the images for your menu and we&apos;ll build it for you.
                </p>
            </header>

            <form className="mx-auto max-w-[1100px]" onSubmit={onSubmit}>
                <div className="mb-7 flex items-baseline justify-between">
                    <h2 className="m-0 text-[2rem] font-extrabold tracking-[-0.02em]">
                        Images
                    </h2>
                    {items.length > 0 && (
                        <button
                            type="button"
                            onClick={clearAll}
                            className="cursor-pointer rounded border-0 bg-transparent text-base font-semibold text-[#4f35e8] hover:underline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#4f35e8]"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg, image/png, image/gif, image/webp"
                    multiple
                    hidden
                    onChange={(e) => {
                        if (e.target.files) addFiles(e.target.files);
                        e.target.value = ""; // allow re-selecting the same file
                    }}
                />

                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col overflow-hidden rounded-3xl border border-[#ececec] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.url}
                                alt={item.file.name}
                                className="block aspect-[4/3] w-full bg-[#fdfaec] object-cover"
                            />
                            <div className="flex items-center justify-between gap-3 px-[18px] py-3.5">
                            <span
                                title={item.file.name}
                                className="truncate text-[0.95rem] font-bold"
                            >
                                {item.file.name}
                            </span>
                                <button
                                    type="button"
                                    aria-label={`Remove ${item.file.name}`}
                                    onClick={() => removeItem(item.id)}
                                    className="h-7 w-7 shrink-0 cursor-pointer rounded-full border-0 bg-[#f1f1f2] text-xs text-neutral-500 transition-colors hover:bg-[#fde8e8] hover:text-[#c62828] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#4f35e8]"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            addFiles(e.dataTransfer.files);
                        }}
                        className={`flex min-h-[260px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[28px] border-2 border-dashed transition-colors focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#4f35e8] ${
                            isDragging
                                ? "border-[#4f35e8] bg-gradient-to-b from-[#eceeff] to-[#dcdff5]"
                                : "border-[#6d6df5] bg-gradient-to-b from-[#f5f7ff] to-[#e8eaf6] hover:border-[#4f35e8] hover:from-[#eceeff] hover:to-[#dcdff5]"
                        }`}
                    >
                    <span className="mb-2.5 grid h-[84px] w-[84px] place-items-center rounded-full bg-[#dfe2fb] text-[#4f35e8]">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 5v14M5 12h14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                        <span className="text-xl font-bold text-[#4f35e8]">
                            {items.length === 0 ? "Select images" : "Add more images"}
                        </span>
                        <span className="text-sm text-[#7a7fb3]">
                            or drag and drop them here
                        </span>
                    </button>
                </div>

                {error && (
                    <p role="alert" className="mt-6 font-semibold text-[#c62828]">
                        {error}
                    </p>
                )}

                <div className="mt-12 flex justify-center">
                    <button
                        type="submit"
                        disabled={items.length === 0 || isSubmitting}
                        className="cursor-pointer rounded-full bg-[#4f35e8] px-10 py-4 text-[1.1rem] font-bold text-white shadow-[0_6px_20px_rgba(79,53,232,0.35)] transition hover:-translate-y-px hover:bg-[#4329d6] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#4f35e8] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#b9b4ee] disabled:shadow-none"
                    >
                        {isSubmitting
                            ? "Creating menu…"
                            : items.length > 0
                                ? `Create menu from ${items.length} image${
                                    items.length === 1 ? "" : "s"
                                }`
                                : "Create menu"}
                    </button>
                </div>
            </form>
        </main>
    );
}