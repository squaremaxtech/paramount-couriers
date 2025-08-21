import aaronProfile from "@/public/testimonials/aaronProfile.jpg"
import jessicaProfile from "@/public/testimonials/jessicaProfile.jpg"
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