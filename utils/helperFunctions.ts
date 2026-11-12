import {AppError} from "@/types/AppError";

export function getStringWithMostDuplicate(arr: string[]) {
    if (arr.length === 0) {
        return null;
    }

    const duplicatesMap: Map<string, number> = new Map();
    let mostDuplicates = "";
    let mostDuplicatesCount = 0;

    for (const item of arr) {
        const currentStrCount = duplicatesMap.has(item) ? duplicatesMap.get(item)! + 1 : 1;
        duplicatesMap.set(item, currentStrCount);

        if (currentStrCount > mostDuplicatesCount) {
            mostDuplicates = item;
            mostDuplicatesCount = currentStrCount;
        }
    }

    return mostDuplicates;
}

export function verifyFile(file: File){
    const MAX_SIZE = 48 * 1024 * 1024; // 48 MiB in bytes
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    // strict check for specific image types
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new AppError(`file ${file.type} is not supported`, 'FILE_TYPE_NOT_SUPPORTED');
    }

    // check if it's too thick
    if (file.size > MAX_SIZE) {
        throw new AppError(`file ${file.name} is too large. Max size is 50MB`, 'FILE_TOO_BIG');
    }
}