import {MenuSchemas} from "@/config/schemas/MenuSchemas";
import {db} from "@/db/index";
import {menus} from "@/db/schema";
import {revalidateTag} from "next/cache";

export async function insertMenuToDb(name: string, theme: string, data: MenuSchemas) {
    const result = await db.insert(menus).values({
        name: "undefined",
        theme: 'default',
        data: data
    }).returning(); // Returns the inserted row(s) as an array

    revalidateTag("menus", "max");

    return result[0]; // Access the new record (e.g., result[0].id)
}