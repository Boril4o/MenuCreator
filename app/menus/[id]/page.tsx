import {getMenuById} from "@/services/menuServices";
import {Suspense} from "react";

export default function MenuPage({params}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <Suspense fallback={<p>Loading menu...</p>}>
            <MenuContent params={params} />
        </Suspense>
    );
}

async function MenuContent({params}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const menu = await getMenuById(Number(id));

    //if (!menu) notFound();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-amber-50 p-16 text-center">
            <h1 className="text-7xl font-bold text-neutral-900">
                {menu?.name ?? "Menu not found"}
            </h1>
            <p className="mt-6 text-3xl text-neutral-600">Menu content goes here</p>
        </main>
    );
}