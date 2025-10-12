import aaronProfile from "@/public/testimonials/aaronProfile.jpg"
import jessicaProfile from "@/public/testimonials/jessicaProfile.jpg"
import { ratePricingType } from "@/types";
import { StaticImageData } from "next/image";

export const siteInfo = {
    emailAddresses: ["info@paramount-couriers.com"],
    addresses: ["Containers Plaza, Poorman’s Corner Yallahs, St Thomas"],
    branches: [
        {
            name: "St. Thomas",
            number: {
                flow: "(876) 343-3661",
                digicel: "(876) 352-5259"
            },
            address: "",
            openingHours: "Mon - Fri 9am to 6pm and Saturday 10am - 4pm"
        },
        {
            name: "Kingston",
            number: {
                flow: "(876) 782-9165",
                digicel: ""
            },
            address: "",
            openingHours: "Mon - Fri 9:30am to 5:30pm and Saturday 10am to 4pm"
        },
    ],
    shippingAddress: {
        street: "3706 NW 16th Street",
        street2: "PMC",
        city: "Lauderhill",
        state: "FL",
        zipCode: "33311-4132",
    },
    socialLinks: {
        "instagram": "couriersparamount"
    }
}

export const servicesData: {
    iconName: string,
    title: string,
    slug: string,
    shortDescription: string,
    description: string,
    subItems: string[],
    amtOfPoints: number,
}[] = [
        {
            iconName: "notifications_active",
            title: "Pre-Alert Your Packages",
            slug: "preAlert",
            shortDescription: "Let us know what you’re shipping by submitting a pre-alert. This helps us prepare for smooth processing.",
            subItems: [
                "Easy online pre-alert form",
                "Instant confirmation",
                "Link multiple items to one account",
            ],
            amtOfPoints: 3,
            description: "Before your items even leave the U.S., submit a pre-alert through our simple online form. This lets us know what to expect, ensures faster processing when your package arrives, and keeps everything organized under your account. Whether you’re shipping one item or many, pre-alerts save time and help avoid delays.",
        },
        {
            iconName: "package_2",
            title: "Package Processing",
            slug: "packageProcessing",
            shortDescription: "Once your items arrive, we create secure packages and prepare them for shipment to Jamaica.",
            subItems: [
                "Items received & verified",
                "Consolidation into one package",
                "Safe packaging & labeling",
            ],
            amtOfPoints: 9,
            description: "Once we receive your goods at our U.S. address, our team immediately gets to work. Every item is verified, secured, and properly packaged for shipping. If you have multiple orders, we can consolidate them into one box to save you on shipping costs. From careful packaging to accurate labeling, we make sure your shipment is ready for a smooth trip to Jamaica.",
        },
        {
            iconName: "location_searching",
            title: "Real-Time Tracking",
            slug: "tracking",
            shortDescription: "Track your package every step of the way, from the U.S. to Jamaica.",
            subItems: [
                "Updates at each checkpoint",
                "Email & SMS notifications",
                "Transparent delivery timeline",
            ],
            amtOfPoints: 5,
            description: "Stay in the loop with real-time package tracking. From the moment we receive your items until they’re handed over in Jamaica, you’ll have full visibility of your shipment. Track updates at every stage, receive notifications by email or SMS, and enjoy the peace of mind that comes with knowing where your package is at all times.",
        },
        {
            iconName: "flight_takeoff",
            title: "Shipment to Jamaica",
            slug: "shipment",
            shortDescription: "We handle all logistics to ensure your package gets to Jamaica quickly and securely.",
            subItems: [
                "Standard shipping",
                "Express shipping",
                "Special handling for large items",
            ],
            amtOfPoints: 11,
            description: "We take care of all the logistics needed to get your items from the U.S. to Jamaica quickly and safely. Choose from standard shipping for regular deliveries or express shipping for urgent items. Large or special-handling goods are also managed with care. No matter the size or urgency, we make sure your package gets to Jamaica securely.",
        },
        {
            iconName: "local_shipping",
            title: "Customs & Arrival",
            slug: "customs",
            shortDescription: "Packages are cleared through customs and prepared for handover in Jamaica.",
            subItems: [
                "Customs processing",
                "Duty & fee guidance",
                "Secure handling on arrival",
            ],
            amtOfPoints: 2,
            description: "We simplify the customs process by handling clearance for you. Our experienced team guides you through any duties or taxes owed, making sure your packages are processed quickly and without unnecessary hold-ups. This means less stress for you and faster access to your goods.",
        },
        {
            iconName: "handshake",
            title: "Final Delivery",
            slug: "delivery",
            shortDescription: "Your package is released and handed directly to you in Jamaica.",
            subItems: [
                "Door-to-door delivery",
                "Pickup at partner locations",
                "Proof of handover",
            ],
            amtOfPoints: 4,
            description: "Once cleared, you choose how to receive your packages. Opt for convenient store-to-door delivery straight to your home or pick up at one of our partner locations across Jamaica. Either way, we make sure your items are delivered securely into your hands.",
        },
    ];

export const testimonialsData: {
    text: string,
    image: StaticImageData,
    name: string,
    position: string,
    rating: number,
}[] = [
        {
            text: "Couriers are distinguished from ordinary mail services by features such as speed, security, tracking, signature, specialization and individualization of express services, and swift delivery times.",
            image: aaronProfile,
            name: "Aron",
            position: "Manager",
            rating: 4,
        },
        {
            text: "Couriers are distinguished from ordinary mail services by features such as speed, security, tracking, signature, specialization and individualization of express services, and swift delivery times.",
            image: jessicaProfile,
            name: "Jessica John",
            position: "Executive",
            rating: 4,
        },
    ]

export const faqData: {
    question: string,
    answer: string,
}[] = [
        {
            question: "How does the service work?",
            answer: "You shop online from any US store, ship to our US address, and we deliver your packages safely to Jamaica. (Shipping done on Monday, Tuesday and Thursday)",
        },
        {
            question: "How do I get started as a new customer?",
            answer: "Simply sign up so and use our address whenever you shop online.",
        },
        {
            question: "What items can I ship?",
            answer: "Most items are accepted, but some goods may be restricted by US or Jamaican customs (e.g., hazardous materials, certain electronics, perishables).",
        },
        {
            question: "How long does delivery take?",
            answer: "Standard shipping usually takes 2 days.",
        },
        {
            question: "How do I pay for shipping?",
            answer: "Shipping charges are calculated based on weight, You can pay online (bank transfer) or at pickup.",
        },
        {
            question: "Can I track my package?",
            answer: "Yes — all shipments come with tracking so you can follow your package from the US to Jamaica.",
        },
        {
            question: "Do you offer home delivery?",
            answer: "Yes, Mon -  Fri 9:30am to 4:30pm and Saturday 10:30am to 3pm",
        },
        {
            question: "How much does shipping cost?",
            answer: "Costs vary based on weight and service. You can check our rates page for details",
        },
    ];

export const rateByWeightArr: ratePricingType[] = [
    { weight: 1, rate: 450 },
    { weight: 2, rate: 750 },
    { weight: 3, rate: 1050 },
    { weight: 4, rate: 1300 },
    { weight: 5, rate: 1575 },
    { weight: 6, rate: 1850 },
    { weight: 7, rate: 2125 },
    { weight: 8, rate: 2400 },
    { weight: 9, rate: 2675 },
    { weight: 10, rate: 2950 },
    { weight: 11, rate: 3200 },
    { weight: 12, rate: 3450 },
    { weight: 13, rate: 3700 },
    { weight: 14, rate: 3950 },
    { weight: 26, rate: 7125 },
    { weight: 27, rate: 7425 },
    { weight: 28, rate: 7725 },
    { weight: 29, rate: 8025 },
    { weight: 30, rate: 8325 },
    { weight: 31, rate: 8625 },
    { weight: 32, rate: 8925 },
    { weight: 33, rate: 9225 },
    { weight: 34, rate: 9525 },
    { weight: 35, rate: 9825 },
    { weight: 36, rate: 10125 },
    { weight: 37, rate: 10435 },
    { weight: 38, rate: 10725 },
    { weight: 39, rate: 11025 },
];