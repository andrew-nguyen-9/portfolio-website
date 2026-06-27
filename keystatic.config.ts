import { config, fields, collection } from "@keystatic/core";

// Local-only authoring GUI over the same content/writing/*.mdx files lib/writing.ts
// reads (v4.7.2). storage:"local" means it edits files on disk and commits via git —
// no hosted backend, no auth surface. The admin route is gated to dev (see
// app/keystatic/*) and excluded from the strict CSP (see middleware matcher).
//
// Schema mirrors the frontmatter contract: the filename is the slug, `title` holds the
// human name, plus summary/publishedAt/tags and the MDX body.
export default config({
  storage: { kind: "local" },
  ui: { brand: { name: "an9.dev" } },
  collections: {
    writing: collection({
      label: "Writing",
      slugField: "title",
      path: "content/writing/*",
      format: { contentField: "body" },
      entryLayout: "content",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        summary: fields.text({ label: "Summary", multiline: true }),
        publishedAt: fields.date({ label: "Published at" }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        body: fields.mdx({ label: "Body" }),
      },
    }),
  },
});
