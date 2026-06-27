import Link from "next/link";
import AffiliateLink from "@/components/AffiliateLink";
import Disclosure from "@/components/Disclosure";

// Element overrides applied when compiling article MDX. Keep this small — the
// .article-prose styles in globals.css do the visual work; this is only for
// behavior that markup alone can't express (safe external links, internal routing).
function Anchor({ href = "", children, ...rest }: React.ComponentProps<"a">) {
  const external = /^https?:\/\//.test(href) && !href.includes("an9.dev");
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

export const mdxComponents = {
  a: Anchor,
  // Usable directly in article MDX, e.g. <AffiliateLink href="…">my mic</AffiliateLink>
  AffiliateLink,
  Disclosure,
};
