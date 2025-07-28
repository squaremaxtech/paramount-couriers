import { packageType } from "@/types";

export function ViewPackage({ seenPackage }: { seenPackage: packageType }) {
    return (
        <div>
            {seenPackage.id}
        </div>
    )
}