import { notFound } from "next/navigation";
import { makePage } from "@keystatic/next/ui/app";
import config from "@/keystatic.config";

// Dev-only authoring UI. In production the admin is hidden (notFound) — local storage
// can't write to Vercel's read-only FS anyway, and we don't want the surface exposed.
const KeystaticPage = makePage(config);

export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return <KeystaticPage />;
}
