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