// FTC-compliant affiliate link: rel="sponsored" tells search engines it's paid, and
// the ::after "partner" marker (globals.css) makes the relationship visible to readers.
// Pair with <Disclosure> on any page/article that uses these.
export default function AffiliateLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className="affiliate-link"
    >
      {children}
    </a>
  );
}
