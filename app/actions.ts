// app/actions.ts
'use server';

import {convertFilesToMenu} from "@/services/menuServices";
import {insertMenuToDb} from "@/db/queries";

export async function uploadMenuFiles(files: File[]): Promise<void> {
    if (!files || files.length == 0) {
        throw new Error("No file uploaded");
    }

    //TODO
    //check for different img file types
    //set limit of file being max 48MiB

    const menu = await convertFilesToMenu(files);
    await insertMenuToDb("Untitled", "default", menu);
}