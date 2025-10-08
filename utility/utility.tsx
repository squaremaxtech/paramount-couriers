import z from "zod"
import { allFilters, dbWithFileType, ensureCanAccessTableReturnType, packageType, provideFilterAndColumnForTableReturnType } from "@/types";
import { errorZodErrorAsString } from "@/useful/consoleErrorWithToast";
import { eq, gte, sql, SQLWrapper } from "drizzle-orm";
import { PgNumeric, PgInteger, PgTableWithColumns, PgEnumColumn, PgText, PgVarchar, PgBoolean, PgDate, PgJsonb, PgTimestamp, PgSerial, PgJson } from 'drizzle-orm/pg-core'

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

export function makeDateTimeLocalInput(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatAsMoney(input: string, minimumFractionDigits = 2) {
    const num = Number(input)
    if (isNaN(num)) return ""

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits,
    }).format(num)
}

export function convertToCurrency(input: number, minimumFractionDigits = 2) {
    return input.toFixed(minimumFractionDigits)
}

export function formatWithCommas(input: string) {
    const num = Number(input)
    if (isNaN(num)) return ""

    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(num)
}

export function formatWeight(weight: string) {
    return `${formatWithCommas(weight)} lb${parseInt(weight) > 1 ? "s" : ""}`
}

export function generateTrackingNumber(id: number, branding: string = "PC"): string {
    const paddedNumber = id.toString().padStart(11, '0');

    return `${branding}${paddedNumber}`;
}

export function extractIdFromTrackingNumber(trackingNumber: string): number {
    const numericPart = trackingNumber.replace(/^[A-Z]+/, '');
    return parseInt(numericPart, 10); // convert remaining part to number
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
    if (option === "both" && ((ensureCanAccessTableReturn.tableErrors !== undefined) || (ensureCanAccessTableReturn.columnErrors !== undefined))) {
        throw new Error(`${ensureCanAccessTableReturn.tableErrors} ${ensureCanAccessTableReturn.columnErrors}`)

    } else if (option === "table" && ensureCanAccessTableReturn.tableErrors !== undefined) {
        throw new Error(ensureCanAccessTableReturn.tableErrors)

    } else if (option === "column" && ensureCanAccessTableReturn.columnErrors !== undefined) {
        throw new Error(ensureCanAccessTableReturn.columnErrors)
    }

    return ensureCanAccessTableReturn.tableColumnAccess
}

export function handleEnsureCanAccessTableResultsBool(ensureCanAccessTableReturn: ensureCanAccessTableReturnType, option: "table" | "column" | "both") {
    try {
        handleEnsureCanAccessTableResults(ensureCanAccessTableReturn, option)

        return true

    } catch (error) {
        return false
    }
}

export function makeWhereClauses<T extends Object>(schema: z.Schema, filter: T, dbSchema: PgTableWithColumns<any>) {
    // Validate filter
    schema.parse(filter);

    //keys and values will have string, number, boolean, object/array with extra info
    //if array - see if wants to check exists - items greater than 1
    //return true
    //maje filter for same
    //itll pass schema check for all else expect object

    const whereClauses: SQLWrapper[] = [];

    // Dynamically process filters
    for (const [keyPre, value] of Object.entries(filter)) {
        const key = keyPre as keyof T

        if (value === undefined || value === null) continue;

        // @ts-expect-error type
        const columnPre = dbSchema[key as keyof typeof dbSchema];
        if (!columnPre) continue;

        const column = columnPre as SQLWrapper

        if (typeof value === "string") {
            if (column instanceof PgNumeric || column instanceof PgInteger || column instanceof PgEnumColumn) {
                whereClauses.push(eq(column, value));

            } else {
                whereClauses.push(sql`LOWER(${column}) LIKE LOWER(${`%${value}%`})`);
            }

        } else if (typeof value === "number") {
            whereClauses.push(eq(column, value));

        } else if (typeof value === "boolean") {
            whereClauses.push(eq(column, value));

        } else if (value instanceof Date) {
            // Match only date
            whereClauses.push(gte(
                column,
                new Date(value)
            ));

        } else if (Array.isArray(value)) {
            //check if array has items
            whereClauses.push(sql`${column}::text != '[]'`);

        } else {
            // fallback or skip unknown types
            continue;
        }
    }

    return whereClauses
}

export function provideFilterAndColumnForTable<T extends PgTableWithColumns<any>>(table: T): provideFilterAndColumnForTableReturnType<T> {
    const filters: Partial<allFilters<T["_"]["columns"]>> = {};
    for (const [keyPre, column] of Object.entries(table)) {
        if (!("columnType" in column)) continue;

        //assign type
        const key = keyPre as keyof T["_"]["columns"]

        if (column instanceof PgInteger || column instanceof PgSerial) {
            filters[key] = {
                type: "number",
                base: {},
            };

        } else if (column instanceof PgText || column instanceof PgVarchar) {
            filters[key] = {
                type: "string",
                base: {},
            };

        } else if (column instanceof PgNumeric) {//speacialized numbers: accurate decimals...etc
            filters[key] = {
                type: "stringNumber",
                base: {},
            };

        } else if (column instanceof PgBoolean) {
            filters[key] = {
                type: "boolean",
                base: {},
            };

        } else if (column instanceof PgDate || column instanceof PgTimestamp) {
            filters[key] = {
                type: "date",
                base: {},
            };

        } else if (column instanceof PgJson || column instanceof PgJsonb) {
            filters[key] = {
                type: "array",
                base: {},
            };

        } else if (column instanceof PgEnumColumn) {
            filters[key] = {
                type: "options",
                options: column["enumValues"],
                base: {},
            };
        }
    }

    return { filters: filters, columns: Object.keys(table) };
}

export function makeDownloadFileUrl(dbWithFile: dbWithFileType) {
    return `/api/files/download?src=${dbWithFile.file.src}&dbFileType=${dbWithFile.file.type}`
}

export function calculatePackageServiceCost(charges: packageType["charges"]) {
    const freight = parseFloat(charges.freight)
    const fuel = parseFloat(charges.fuel)
    const insurance = parseFloat(charges.insurance)

    return freight + fuel + insurance
}

type Generic = Record<string, any>

/** Convert active filters (base.using === true) to query params */
export function filtersToQuery<T extends Generic>(filters: allFilters<T>) {
    const params = new URLSearchParams()

    for (const key in filters) {
        const filter = filters[key]
        if (!filter || !filter.base?.using) continue

        switch (filter.type) {
            case "boolean":
                if (filter.value !== undefined) params.set(key, String(filter.value))
                break
            case "number":
            case "string":
            case "stringNumber":
                if (filter.value !== undefined && filter.value !== "")
                    params.set(key, String(filter.value))
                break
            case "options":
                if (filter.value) params.set(key, filter.value)
                break
            case "date":
                if (filter.value) params.set(key, filter.value.toISOString())
                break
            case "array":
                if (Array.isArray(filter.value) && filter.value.length > 0)
                    params.set(key, JSON.stringify(filter.value))
                break
        }
    }

    return params
}

/** Restore filters from URLSearchParams */
export function filtersFromQuery<T extends Generic>(
    params: URLSearchParams,
    currentFilters: allFilters<T>
) {
    const updated: allFilters<T> = { ...currentFilters }

    for (const key in updated) {
        const filter = updated[key]
        if (!filter) continue

        const value = params.get(key)
        if (value === null) continue

        switch (filter.type) {
            case "boolean":
                filter.value = value === "true"
                break
            case "number":
                filter.value = Number(value)
                break
            case "string":
            case "stringNumber":
            case "options":
                filter.value = value
                break
            case "date":
                filter.value = new Date(value)
                break
            case "array":
                try {
                    filter.value = JSON.parse(value)
                } catch {
                    filter.value = []
                }
                break
        }

        // Mark as used
        filter.base = { ...filter.base, using: true }
    }

    return updated
}
