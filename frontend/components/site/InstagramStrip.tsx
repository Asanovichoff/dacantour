import Image from "next/image";
import { Instagram } from "lucide-react";
import { instagramPosts, CONTACT } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";

export function InstagramStrip() {
  return (
    <section className="bg-sand-deep py-20">
      <div className="container-wide">
        <Reveal className="mb-10 flex flex-col items-center text-center">
          <span className="overline">Follow the journey</span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            @dacantour on Instagram
          </h2>
          <p className="mt-3 max-w-md text-stone-500">
            Real photos from real trips. This is where Dacan Tour started — and
            where you can see the next view before you book.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-2 gap-1.5 px-1.5 sm:grid-cols-4 md:grid-cols-8">
        {instagramPosts.map((post) => (
          <a
            key={post.id}
            href={post.href}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden"
          >
            <Image
              src={post.image}
              alt="Dacan Tour on Instagram"
              fill
              sizes="(max-width: 768px) 50vw, 12vw"
              className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-110"
            />
            <span className="absolute inset-0 grid place-items-center bg-ink/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Instagram className="h-6 w-6 text-white" />
            </span>
          </a>
        ))}
      </div>

      <div className="container-wide mt-10 text-center">
        <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="btn-outline">
          <Instagram className="h-4 w-4" /> See more on Instagram
        </a>
      </div>
    </section>
  );
}
