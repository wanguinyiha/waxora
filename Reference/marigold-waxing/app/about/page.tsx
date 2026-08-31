import Image from "next/image";
import { Metadata } from "next";
import Button from "@/components/Button";

export const metadata: Metadata = { title: "About · Marigold Waxing Studio" };

const values = [
  {
    title: "Trained, not just certified",
    body: "Every Cerologist completes supervised hands-on hours before working solo — certification is the floor, not the finish line.",
  },
  {
    title: "Say what's happening",
    body: "You'll know what area is next and what to expect before it happens. No surprises mid-service.",
  },
  {
    title: "No pressure add-ons",
    body: "We'll mention a service if it genuinely fits what you're asking for. We won't if it doesn't.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:px-10 md:py-24">
        <div>
          <h1 className="font-serif text-4xl leading-tight text-on-background md:text-5xl">
            Started by someone tired of rushed appointments.
          </h1>
          <p className="mt-6 leading-relaxed text-on-surface-muted">
            Marigold opened in 2019 after our founder, a longtime esthetician, kept hearing the
            same complaint from clients: waxing appointments felt transactional, rushed, and
            occasionally painful in ways that seemed avoidable. Marigold was built around a
            different pace — private rooms, unhurried appointments, and a wax formulated for
            comfort rather than speed alone.
          </p>
          <p className="mt-4 leading-relaxed text-on-surface-muted">
            Today we run two studio locations with a team of Cerologists who each complete
            supervised training hours before working independently.
          </p>
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src="https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=900&q=80"
            alt="Interior of a calm, plant-filled waxing studio"
            width={900}
            height={675}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
          <h2 className="font-serif text-3xl text-on-background">What we hold ourselves to</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title}>
                <h3 className="font-serif text-xl text-on-background">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-on-surface-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-16 text-center md:px-10 md:py-24">
        <h2 className="font-serif text-3xl text-on-background">Come see for yourself</h2>
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
