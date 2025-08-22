import aaronProfile from "@/public/testimonials/aaronProfile.jpg"
import jessicaProfile from "@/public/testimonials/jessicaProfile.jpg"
import { ratePricingType } from "@/types";
import { StaticImageData } from "next/image";

export const siteInfo = {
    emailAddresses: ["example@example.com", "info@example.com"],
    addresses: ["12/A Daddy Yankee Tower", "12/A Daddy Yankee Tower"],
    phoneNumbers: ["+123 456 789 29", "123 478 373 38"],
}

export const servicesData: {
    iconName: string,
    title: string,
    link: string,
    shortDescription: string,
    subItems: string[],
}[] = [
        {
            iconName: "plane_contrails",
            title: "Flat Rate Fees",
            link: "/services",
            shortDescription: "Couriers are distinguished from ordinary mail services by features such as speed, security, tracking",
            subItems: [
                "Standard Courier",
                "Express Courier",
                "Pallet Courier"
            ],
        },
        {
            iconName: "conveyor_belt",
            title: "Apply Online",
            link: "/services",
            shortDescription: "Couriers are distinguished from ordinary mail services by features such as speed, security, tracking",
            subItems: [
                "Standard Courier",
                "Express Courier",
                "Pallet Courier"
            ],
        },
        {
            iconName: "delivery_truck_speed",
            title: "Submit Documents",
            link: "/services",
            shortDescription: "Couriers are distinguished from ordinary mail services by features such as speed, security, tracking",
            subItems: [
                "Standard Courier",
                "Express Courier",
                "Pallet Courier",
            ],
        },
        {
            iconName: "package_2",
            title: "Receive Goods",
            link: "/services",
            shortDescription: "Couriers are distinguished from ordinary mail services by features such as speed, security, tracking",
            subItems: [
                "Standard Courier",
                "Express Courier",
                "Pallet Courier"
            ],
        },
        {
            iconName: "location_home",
            title: "Standard Courier",
            link: "/services",
            shortDescription: "Couriers are distinguished from ordinary mail services by features such as speed, security, tracking",
            subItems: [
                "Standard Courier",
                "Express Courier",
                "Pallet Courier"
            ],
        },
        {
            iconName: "orders",
            title: "Standard Courier",
            link: "/services",
            shortDescription: "Couriers are distinguished from ordinary mail services by features such as speed, security, tracking",
            subItems: [
                "Standard Courier",
                "Express Courier",
                "Pallet Courier"
            ],
        }
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