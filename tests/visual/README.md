# Visual regression (v4.6.3)

Screenshots stable content pages (`/writing`, an article, a project detail, `/uses`,
`/now`) in light + dark and diffs them against committed baselines. Part of the local
segment-QA loop — **not** the CI gate: baselines are platform-specific
(`*-chromium-darwin.png`) and would mismatch on CI's Linux renderer.

```bash
npm run test:visual                    # check against baselines
npm run test:visual -- --update-snapshots   # reseed after intentional UI changes
```

The homepage is intentionally excluded (live Spotify data + hero animation make pixel
diffs flaky). `playwright.config.ts` builds + starts a production server automatically.
