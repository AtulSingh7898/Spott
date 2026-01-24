import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
/**
 * Render the home page hero section with title, description, call-to-action, and illustrative image.
 *
 * The component displays a branded tagline, a multi-line headline with a highlighted word,
 * a short descriptive paragraph, a "Get Started" button linking to /explore, and a responsive hero image.
 * Layout adapts responsively to screen size.
 *
 * @returns {JSX.Element} The hero section JSX for the home page.
 */

export default function Home() {
  return (
    <div>
      <section className="pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* left  */}
          <div className="text-center sm:text-left">
          <span className="text-gray-500 font-light tracking-wide">
            spott <span  className="text-purple-400">*</span>
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[0.95] tracking-tight">
            Discorver & <br />
            Create Amazing
            <br />
            <span className="bg-linear-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">Event.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-lg font-light">
              Whether you&apos;re hosting or attending, Spott makes every event
              memorable. Join our community today.
            </p>

            <Link href="/explore">
              <Button size="xl" className={"rounded-full"}>
                Get Started
              </Button>
            </Link>
          
          </div>
          {/* right  */}
          <Image
              src="/hero.png"
              // src="/hero.gif"
              alt="react meetup"
              width={700}
              height={700}
              className="w-full h-auto"
              priority
            />
        </div>
      </section>
    </div>
  );
}