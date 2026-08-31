import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Gallery · Marigold Waxing Studio" };

const images = [
  { src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80", alt: "Treatment room with soft lighting", tall: true },
  { src: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80", alt: "Skincare products on a counter" },
  { src: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&q=80", alt: "Studio waiting area" },
  { src: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=80", alt: "Esthetician preparing for an appointment", tall: true },
  { src: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80", alt: "Neatly arranged studio towels" },
  { src: "https://images.unsplash.com/photo-1470259078422-826894b933aa?w=800&q=80", alt: "Front desk and reception area" },
];

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
      <div className="max-w-[60ch]">
        <h1 className="font-serif text-4xl text-on-background">Inside our studios</h1>
        <p className="mt-4 leading-relaxed text-on-surface-muted">
          A look at the spaces where appointments happen — calm, private, and kept spotless
          between every client.
        </p>
      </div>

      <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {images.map((img) => (
          <div
            key={img.src}
            className={`mb-5 break-inside-avoid overflow-hidden rounded-lg ${img.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={800}
              height={img.tall ? 1067 : 600}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
