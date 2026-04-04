// Version 1.0.1 - Forced sync
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
  return null;
}
