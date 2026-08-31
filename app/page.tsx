import Image from "next/image";
import Button from "@/components/Button";
import ServiceCard from "@/components/ServiceCard";
import ReviewCard from "@/components/ReviewCard";
import { services, reviews } from "@/lib/data";

export default function Home() {
  const popular = services.filter((s) => s.popular);
  const topReviews = reviews.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:px-10 md:py-24">
        <div>
          <h1 className="font-semibold text-[2.75rem] leading-[1.08] tracking-tight text-on-background md:text-[3.4rem]">
            Smooth skin,
            <br />
            <span className="text-primary">handled with care.</span>
          </h1>
          <p className="mt-6 max-w-[42ch] text-[17px] leading-relaxed text-on-surface-muted">
            Face, body, and brow waxing from Cerologists trained to make it quick, precise, and
            far more comfortable than you'd expect. Walk in tense, walk out smooth.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/booking">Book an appointment</Button>
            <Button href="/services" variant="outline">
              Browse services
            </Button>
          </div>
          <div className="mt-10 flex gap-8 border-t border-outline pt-6 text-sm">
            <div>
              <p className="font-semibold text-2xl text-on-background">4.9</p>
              <p className="mt-1 text-on-surface-muted">Average rating</p>
            </div>
            <div>
              <p className="font-semibold text-2xl text-on-background">12k+</p>
              <p className="mt-1 text-on-surface-muted">Appointments a year</p>
            </div>
            <div>
              <p className="font-semibold text-2xl text-on-background">2</p>
              <p className="mt-1 text-on-surface-muted">Studio locations</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-lg bg-surface">
            <Image
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80"
              alt="A calm, softly lit waxing studio treatment room"
              width={900}
              height={1125}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-8 -left-8 hidden aspect-square w-40 overflow-hidden rounded-lg border-4 border-background shadow-raised md:block">
            <Image
              src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80"
              alt="Skincare products arranged on a studio counter"
              width={400}
              height={400}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Popular services */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-semibold text-3xl text-primary">Most-booked services</h2>
            <p className="mt-2 max-w-[50ch] text-on-surface-muted">
              A starting point, not the whole menu — see everything we offer with full prep and
              aftercare details.
            </p>
          </div>
          <Button href="/services" variant="outline" className="w-fit">
            View all services
          </Button>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-surface">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:px-10 md:py-24">
          <div className="order-2 aspect-[4/3] overflow-hidden rounded-lg md:order-1">
            <Image
              src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=900&q=80"
              alt="An esthetician preparing wax during an appointment"
              width={900}
              height={675}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-semibold text-3xl text-primary md:text-4xl">
              Trained hands, formulated wax, no guesswork.
            </h2>
            <p className="mt-5 max-w-[48ch] leading-relaxed text-on-surface-muted">
              Every Cerologist completes hands-on training before they see a client, and our wax
              is formulated to grip hair rather than skin — which is most of why our appointments
              run comfortably rather than painfully. You'll always know what's happening before
              it happens.
            </p>
            <ul className="mt-6 flex flex-col gap-3 text-sm text-on-surface">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Single-use application sticks, every time
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Low-temperature wax suited to sensitive skin
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Private rooms for every body service
              </li>
            </ul>
            <Button href="/about" className="mt-8 w-fit">
              Get to know us
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="font-semibold text-3xl text-primary">What clients say</h2>
          <Button href="/reviews" variant="outline" className="w-fit">
            Read all reviews
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {topReviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-6 px-6 py-16 text-on-primary md:flex-row md:items-center md:justify-between md:px-10 md:py-20">
          <div>
            <h2 className="font-semibold text-3xl md:text-4xl">Ready for your next appointment?</h2>
            <p className="mt-3 max-w-[46ch] text-on-primary/80">
              Pick a service, choose a time that works, and we'll take care of the rest.
            </p>
          </div>
          <Button href="/booking" className="bg-white text-primary hover:bg-white/90">
            Book an appointment
          </Button>
        </div>
      </section>
    </div>
  );
}
