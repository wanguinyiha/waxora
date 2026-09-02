import Image from "next/image";
import { Metadata } from "next";
import Button from "@/components/Button";
import { getSiteSetting } from "@/lib/supabase/queries";

export const metadata: Metadata = { title: "About · Waxora" };

export default async function AboutPage() {
  const [valuesData, heroImageData] = await Promise.all([
    getSiteSetting("company_values"),
    getSiteSetting("about_hero_image"),
  ]);

  const values = (valuesData as unknown as Array<{ title: string; body: string }>) ?? [];
  const heroImage = heroImageData as unknown as { src: string; alt: string } | null;

  return (
    <div>
      <section className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:px-10 md:py-24">
        <div>
          <h1 className="font-semibold text-4xl leading-tight text-primary md:text-5xl">
            Started by someone tired of rushed appointments.
          </h1>
          <p className="mt-6 leading-relaxed text-on-surface-muted">
            Waxora opened in 2019 after our founder, a longtime esthetician, kept hearing the
            same complaint from clients: waxing appointments felt transactional, rushed, and
            occasionally painful in ways that seemed avoidable. Waxora was built around a
            different pace — private rooms, unhurried appointments, and a wax formulated for
            comfort rather than speed alone.
          </p>
          <p className="mt-4 leading-relaxed text-on-surface-muted">
            Today we run two studio locations with a team of Cerologists who each complete
            supervised training hours before working independently.
          </p>
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-lg">
          {heroImage && (
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              width={900}
              height={675}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
          <h2 className="font-semibold text-3xl text-on-background">What we hold ourselves to</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title}>
                <h3 className="font-semibold text-xl text-on-background">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-on-surface-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-16 text-center md:px-10 md:py-24">
        <h2 className="font-semibold text-3xl text-on-background">Come see for yourself</h2>
        <p className="mx-auto mt-3 max-w-[46ch] text-on-surface-muted">
          The easiest way to understand what makes an appointment here different is to book one.
        </p>
        <Button href="/booking" className="mt-8 w-fit">
          Book an appointment
        </Button>
      </section>
    </div>
  );
}
