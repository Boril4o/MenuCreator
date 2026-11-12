// app/actions.ts
'use server';

import {convertFilesToMenu} from "@/services/menuServices";
import {insertMenuToDb} from "@/db/queries";
import {verifyFile} from "@/utils/helperFunctions";
import {AppError} from "@/types/AppError";
import {ActionResponse} from "@/types/ActionResponse";

export async function uploadMenuFiles(files: File[]): Promise<ActionResponse<number>> {
    let response: ActionResponse<number>;

    try {
        if (!files || files.length == 0) {
            response = {
                success: false,
                code: 'BAD_INPUT',
                message: 'No files uploaded',
            };

            return response;
        }

        for (const file of files) {
            verifyFile(file);
        }

        const menu = await convertFilesToMenu(files);
        const insertResult = await insertMenuToDb("Untitled", "default", menu);
        response = {
            success: true,
            data: insertResult.id,
        }
    }
    catch (e) {
        response = {
            success: false,
            code: 'NOT_SPECIFIED',
            message: `Error calling DeepSeek API: ${String(e)}`,
        };

        if (e instanceof Error) {
            response = {
                success: false,
                code: 'NOT_SPECIFIED',
                message: e.message,
            };
        }
        else if (e instanceof AppError) {
            response = {
                success: false,
                code: e.code,
                message: e.message
            };
        }
    }

    return response;
}