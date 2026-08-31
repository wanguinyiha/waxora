import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Button from "@/components/Button";
import { blogPosts } from "@/lib/data";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  return { title: post ? `${post.title} · Marigold Waxing Studio` : "Post not found" };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-[720px] px-6 py-16 md:px-10 md:py-20">
      <Link href="/blog" className="text-sm text-on-surface-muted hover:text-on-background">
        ← All articles
      </Link>
      <p className="mt-6 text-xs text-on-surface-muted">
        {post.category} · {post.readTime}
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-on-background">{post.title}</h1>
      <p className="mt-4 text-sm text-on-surface-muted">
        {new Date(post.date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <div className="mt-10 flex flex-col gap-5">
        {post.body.map((paragraph, i) => (
          <p key={i} className="text-[17px] leading-relaxed text-on-surface">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-14 rounded-lg border border-outline bg-surface p-6">
        <p className="font-serif text-xl text-on-background">Ready to book?</p>
        <p className="mt-2 text-sm text-on-surface-muted">
          Put this into practice at your next appointment.
        </p>
        <Button href="/booking" className="mt-5 w-fit">
          Book an appointment
        </Button>
      </div>
    </article>
  );
}
