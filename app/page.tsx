import NewMenuCard from "@/components/NewMenuCard";
import {getMenus} from "@/services/menuServices";
import MenuCard from "@/components/MenuCard";

export default async function Home() {
    const allMenus = await getMenus();

    return (
        <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-indigo-50/40">
            {/* Header */}
            <header className="px-6 pb-16 pt-20 text-center">
                <h1 className="text-5xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
                    Menu Creator
                </h1>
                <p className="mx-auto mt-4 max-w-md text-lg text-neutral-500">
                    Design, preview and manage all your menus in one place.
                </p>
            </header>

            {/* Menus */}
            <section className="mx-auto max-w-6xl px-6 pb-24">
                <div className="mb-8 flex items-baseline gap-3">
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                        Menus
                    </h2>
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8">
                    {allMenus.map((menu) => (
                        <MenuCard key={menu.id} {...menu} />
                    ))}
                    <NewMenuCard />
                </div>
            </section>
        </main>
    );
}