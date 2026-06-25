// FTC affiliate disclosure. Render near the top of any page/article containing
// <AffiliateLink>s. Default copy is honest + plain; override via children if needed.
export default function Disclosure({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="affiliate-disclosure" role="note" aria-label="Affiliate disclosure">
      {children ??
        "Some links here are affiliate links — if you buy through them I may earn a small commission, at no extra cost to you. I only list things I actually use and reach for."}
    </aside>
  );
}
