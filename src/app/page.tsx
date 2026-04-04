import { redirect } from "next-auth"; // Wait, in Next.js 13+ App Router, it's next/navigation
import { redirect as nextRedirect } from "next/navigation";

export default function Home() {
  nextRedirect("/dashboard");
  return null;
}
