import Link from "next/link";

const columns = [
  {
    title: "Visit",
    links: [
      { href: "/services", label: "Services" },
      { href: "/booking", label: "Book an appointment" },
      { href: "/gallery", label: "Studio gallery" },
      { href: "/contact", label: "Find us" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/faq", label: "FAQ" },
      { href: "/reviews", label: "Reviews" },
      { href: "/about", label: "About us" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account", label: "My appointments" },
      { href: "/contact", label: "Contact support" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-shell-base text-on-shell">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-16 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:px-10">
        <div>
          <p className="font-serif text-2xl">Marigold</p>
          <p className="mt-3 max-w-[32ch] text-sm text-on-shell/70">
            Waxing, done with care and a steady hand. Two studio locations, one standard of skin
            care.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-medium text-on-shell/50">{col.title}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-on-shell/80 transition-colors hover:text-on-shell"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 border-t border-on-shell/10 px-6 py-6 text-xs text-on-shell/50 md:flex-row md:items-center md:justify-between md:px-10">
        <p>© {new Date().getFullYear()} Marigold Waxing Studio. All rights reserved.</p>
        <div className="flex gap-5">
          <Link href="/faq" className="hover:text-on-shell/80">
            Privacy
          </Link>
          <Link href="/faq" className="hover:text-on-shell/80">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
