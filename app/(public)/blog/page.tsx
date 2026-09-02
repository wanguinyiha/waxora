import Link from "next/link";
import { Metadata } from "next";
import { getBlogPosts } from "@/lib/supabase/queries";

export const metadata: Metadata = { title: "Blog · Waxora" };

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-16 md:px-10 md:py-20">
      <div className="max-w-[60ch]">
        <h1 className="font-semibold text-4xl text-primary">Waxing advice</h1>
        <p className="mt-4 leading-relaxed text-on-surface-muted">
          Practical answers to the questions we hear most, from timing your first appointment to
          keeping skin smooth in between.
        </p>
      </div>

      <div className="mt-12 flex flex-col divide-y divide-outline">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group grid gap-2 py-8 first:pt-0 md:grid-cols-[1fr_auto] md:items-baseline md:gap-8"
          >
            <div>
              <p className="text-xs text-on-surface-muted">{post.category}</p>
              <h2 className="mt-2 font-semibold text-2xl text-on-background transition-colors group-hover:text-primary-strong">
                {post.title}
              </h2>
              <p className="mt-2 max-w-[65ch] leading-relaxed text-on-surface-muted">
                {post.excerpt}
              </p>
            </div>
            <p className="whitespace-nowrap text-sm text-on-surface-muted">{post.read_time}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
