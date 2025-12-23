import { redirect } from "next/navigation";
import { MarketingLanding } from "~/components/marketing-landing";
import { auth } from "~/server/auth";

export default async function IndexPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <>
      <MarketingLanding
        signInHref="/api/auth/signin?callbackUrl=/dashboard"
        appHref="/dashboard"
      />
    </>
  );
}
