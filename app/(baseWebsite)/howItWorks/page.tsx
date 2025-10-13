import React from "react";

export default function Page() {
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-10">
            <section>
                <h1 className="text-3xl font-bold mb-4 text-center">How It Works</h1>
                <p className="text-lg text-gray-700 text-center">
                    Getting your packages from the U.S. to Jamaica has never been easier.
                    Follow these simple steps to ship with Paramount Couriers.
                </p>
            </section>

            <section className="space-y-8">
                <div>
                    <h2 className="text-xl font-semibold mb-2">1. Log In to Your Account</h2>
                    <p className="text-gray-700">
                        Start by logging into your Paramount Couriers account. If you’re on
                        mobile, tap the <strong>bar icon</strong> at the top right corner to
                        open the navigation menu.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">2. Open Your Dashboard</h2>
                    <p className="text-gray-700">
                        From the menu, select <strong>Dashboard</strong>. Here, you can view
                        your U.S. shipping address and manage all your incoming packages.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">3. View Your U.S. Address</h2>
                    <p className="text-gray-700">
                        On your dashboard, click <strong>View U.S. Address</strong> to find
                        your personal shipping address. Be sure your name includes{" "}
                        <strong>“PMC”</strong> — this helps our team and shipping partners
                        identify your packages quickly.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">4. Pre-Alert Your Package</h2>
                    <p className="text-gray-700">
                        Once you’ve placed an order from your favorite U.S. store, come back
                        to your dashboard and select <strong>Pre-Alert Package</strong>.
                        Enter your tracking details so we can start monitoring your shipment
                        as soon as it arrives at our U.S. warehouse.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">5. Track Your Shipment</h2>
                    <p className="text-gray-700">
                        Sit back and relax! You’ll receive regular updates on your package
                        from the moment it’s received to when it arrives safely in Jamaica.
                        We’ll handle everything in between.
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2 text-center">That’s It!</h2>
                <p className="text-gray-700 text-center">
                    With Paramount Couriers, shipping from the U.S. to Jamaica is simple,
                    secure, and stress-free. Log in today and start shipping smarter.
                </p>
            </section>
        </div>
    );
}