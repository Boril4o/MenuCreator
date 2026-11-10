import Link from "next/link";

export default function NewMenuCard() {
    return (
        <Link
            href="/menus/new"
            className="group flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-neutral-300 bg-white/50 text-neutral-500 transition duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:bg-indigo-50/60 hover:text-indigo-600"
        >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 transition group-hover:bg-indigo-100">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    className="h-7 w-7"
                >
                    <path d="M12 5v14M5 12h14" />
                </svg>
            </span>
            <span className="text-base font-semibold">Create new menu</span>
        </Link>
    );
}