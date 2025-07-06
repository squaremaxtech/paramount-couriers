"use client"
import ImageCarousel from "@/components/imageCarousel/ImageCarousel";
import { consoleAndToastError } from "@/useful/consoleErrorWithToast";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";





export default function Home() {
  const usingTestButton = false

  return (
    <main>
      {usingTestButton && (
        <button
          onClick={() => {
            try {
              toast.success("clicked")

            } catch (error) {
              consoleAndToastError(error)
            }
          }}
        >click</button>
      )}

      <ImageCarousel style={{ backgroundColor: "#000" }}
        childEls={[
          {
            supportingTitle: "Fast, reliable, and transparent U.S. shipping directly to your hands in Jamaica.",
            Heading: "Ship with Confidence to Jamaica",
            summary: "",
            buttonText: "get started",
            link: "/services",
            image: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg"
          },
          {
            supportingTitle: "Fast, reliable, and transparent U.S. shipping directly to your hands in Jamaica.",
            Heading: "Ship with Confidence to Jamaica",
            summary: "",
            buttonText: "get started",
            link: "/services",
            image: "https://images.pexels.com/photos/4440788/pexels-photo-4440788.jpeg"
          },
        ].map((eachItem, eachItemIndex) => {
          return (
            <div key={eachItemIndex} style={{ padding: "5rem var(--spacingR)", color: "#fff", position: "relative" }}>
              <Image alt={`${eachItem.Heading}'s image`} src={eachItem.image} priority={true} width={1920} height={1920} style={{ objectFit: "cover", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" } as React.CSSProperties} />

              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6  )" }}></div>

              <div style={{ display: "grid", gap: "var(--spacingR)", position: "relative" }}>
                <h1>{eachItem.Heading}</h1>

                <p className='supportingTitle1'>{eachItem.supportingTitle}</p>

                <p>{eachItem.summary}</p>

                <Link href={eachItem.link} style={{ justifySelf: "flex-start", display: "inline-block", animationDelay: "600ms" }}>
                  <button className='button2'>{eachItem.buttonText}</button>
                </Link>
              </div>
            </div>
          )
        })}
      />
    </main>
  );
}