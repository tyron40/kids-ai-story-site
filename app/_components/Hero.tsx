import { Button } from "@nextui-org/button"
import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="px-responsive-md md:px-28 lg:px-44 mt-responsive-md h-full min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-responsive-3xl text-primary font-extrabold py-responsive-md">
          Turn Your Child’s Imagination into Magical Stories Instantly
          </h2>
          <p className="text-responsive-lg text-primary font-light">
          Design unique and exciting tales that turn your child into the hero of their own story 
          inspiring creativity and a love for reading in just a few clicks!
          </p>
          <Link href={"/create-story"}>
            <Button
              size="lg"
              color="primary"
              className="mt-responsive-md font-bold text-responsive-base p-6 w-full md:w-auto"
            >
              Create Story
            </Button>
          </Link>
        </div>
        <div className="order-1 md:order-2">
          <Image 
            src="/hero.png" 
            alt="hero" 
            width={700} 
            height={400}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  )
}
