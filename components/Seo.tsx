// Per-route head SEO, authored as JSX so React 19 hoists <title>/<meta>/<link> into
// <head> even under the dynamic (nonce-CSP) render — where Next's generateMetadata
// stream lands in <body> and a browser/crawler would miss the canonical + title.
// The homepage does this inline in app/layout.tsx; sub-routes use this component.
// (Pages keep generateMetadata too — that output is a harmless <body> duplicate; the
// <head> tags here are the authoritative ones.)
export default function Seo({
  title,
  description,
  canonical,
  ogType = "website",
  ogImage,
}: {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  ogImage?: string;
}) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="an9.dev" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </>
  );
}
