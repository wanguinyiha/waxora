import Image from "next/image";
import { Metadata } from "next";
import { getActiveGalleryImages } from "@/lib/supabase/queries";

export const metadata: Metadata = { title: "Gallery · Waxora" };

export default async function GalleryPage() {
  const images = await getActiveGalleryImages();

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
      <div className="max-w-[60ch]">
        <h1 className="font-semibold text-4xl text-primary">Inside our studios</h1>
        <p className="mt-4 leading-relaxed text-on-surface-muted">
          A look at the spaces where appointments happen — calm, private, and kept spotless
          between every client.
        </p>
      </div>

      <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {images.map((img) => (
          <div
            key={img.id}
            className={`mb-5 break-inside-avoid overflow-hidden rounded-lg ${img.is_tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={800}
              height={img.is_tall ? 1067 : 600}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
