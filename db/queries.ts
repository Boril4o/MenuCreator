import {MenuData} from "@/config/schemas/MenuData";
import {db} from "@/db/index";
import {menus} from "@/db/schema";

export async function insertMenuToDb(name: string, theme: string, data: MenuData) {
    const result = await db.insert(menus).values({
        name: "undefined",
        theme: 'default',
        data: data
    }).returning(); // Returns the inserted row(s) as an array

    return result[0]; // Access the new record (e.g., result[0].id)
}