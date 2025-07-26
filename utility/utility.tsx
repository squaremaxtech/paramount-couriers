import { ensureCanAccessTableReturnType } from "@/types";
import { errorZodErrorAsString } from "@/useful/consoleErrorWithToast";

export function deepClone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object))
}

export function moveItemInArray<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
    const newArr = [...arr]; // Clone to avoid mutation

    const [movedItem] = newArr.splice(fromIndex, 1); // Remove item

    newArr.splice(toIndex, 0, movedItem); // Insert at new position

    return newArr;
}

export function spaceCamelCase(seenString: string) {
    return seenString.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })
}

export function formatLocalDateTime(seenDate: Date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };

    //@ts-expect-error type
    const customDateTime = seenDate.toLocaleString('en-US', options);
    return customDateTime
}

export function makeValidFilename(input: string, options: { replacement?: string } = {}) {
    const { replacement = "_" } = options;

    return input
        // Replace invalid characters
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, replacement)
        .replace(/[. ]+$/, "")
}

export async function safeServerErrors(func: () => Promise<void>) {
    try {
        await func()

    } catch (error) {
        return errorZodErrorAsString(error)
    }
}

export function handleEnsureCanAccessTableResults(ensureCanAccessTableReturn: ensureCanAccessTableReturnType, option: "table" | "column" | "both") {
    if (option === "both" && ((ensureCanAccessTableReturn.columnErrors !== undefined) || (ensureCanAccessTableReturn.columnErrors !== undefined))) {
        throw new Error(`${ensureCanAccessTableReturn.tableErrors} ${ensureCanAccessTableReturn.columnErrors}`)

    } else if (option === "table" && ensureCanAccessTableReturn.tableErrors !== undefined) {
        throw new Error(ensureCanAccessTableReturn.tableErrors)

    } else if (option === "column" && ensureCanAccessTableReturn.columnErrors !== undefined) {
        throw new Error(ensureCanAccessTableReturn.columnErrors)
    }

    return ensureCanAccessTableReturn.tableColumnAccess
}