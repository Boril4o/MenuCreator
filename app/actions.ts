// app/actions.ts
'use server';

import {convertFilesToMenu} from "@/services/menuServices";
import {insertMenuToDb} from "@/db/queries";

export async function uploadMenuFiles(formData: FormData) {
    // Use .getAll() to retrieve an array of files
    const files = formData.getAll('files') as File[];

    if (!files || files.length == 0) {
        throw new Error("No file uploaded");
    }

    //TODO
    //check for different img file types
    //set limit of file being max 48MiB

    const menu = await convertFilesToMenu(files);
    await insertMenuToDb("Untitled", "default", menu);
}