import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function IndexPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");
  redirect("/api/auth/signin");
}
