import { packageType } from "@/types";

export function ViewPackage({ seenPackage }: { seenPackage: packageType }) {
    return (
        <div>
            <div>
                <div>
                    <div>
                        <h2>Package from {seenPackage.store}</h2>
                        <p>{seenPackage.description}</p>
                        <p>Consignee: {seenPackage.consignee}</p>
                        <p>Tracking #: {seenPackage.trackingNumber}</p>
                        <p >Created: {new Date(seenPackage.dateCreated).toLocaleDateString()}</p>
                    </div>

                    <p>{seenPackage.needAttention ? "Needs Attention" : "Normal"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">{seenPackage.location}</p>
                    </div>
                    <div>
                        <p className="font-medium">Status</p>
                        <p className="text-muted-foreground">{seenPackage.status}</p>
                    </div>
                    <div>
                        <p className="font-medium">Weight</p>
                        <p className="text-muted-foreground">{seenPackage.weight} lbs</p>
                    </div>
                    <div>
                        <p className="font-medium">Price</p>
                        <p className="text-muted-foreground">${seenPackage.price}</p>
                    </div>
                    <div>
                        <p className="font-medium">Payment</p>
                        <p className="text-muted-foreground">${seenPackage.payment}</p>
                    </div>
                </div>

                {seenPackage.comments && (
                    <>
                        <div>
                            <p className="font-medium">Comments</p>
                            <p className="text-muted-foreground whitespace-pre-line">{seenPackage.comments}</p>
                        </div>
                    </>
                )}

                {seenPackage.images?.length > 0 && (
                    <>
                        <div>
                            <p className="font-medium mb-2">Images</p>
                            <div className="flex gap-3 flex-wrap">
                                {/* {seenPackage.images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img.file.src}
                                        alt={img.alt}
                                    />
                                ))} */}
                            </div>
                        </div>
                    </>
                )}

                {seenPackage.invoices?.length > 0 && (
                    <>
                        <div>
                            <p>Invoices</p>
                            <ul>
                                {seenPackage.invoices.map((invoice, i) => (
                                    <li key={i}>
                                        {invoice.file.fileName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}