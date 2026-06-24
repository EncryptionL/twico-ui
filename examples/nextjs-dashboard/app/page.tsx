import { redirect } from "next/navigation";

// Entry point: send everyone to the dashboard. The proxy then bounces
// unauthenticated visitors to /login (and back here after they sign in).
export default function Home() {
  redirect("/dashboard");
}
