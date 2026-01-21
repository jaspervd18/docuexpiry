import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AuthSignInCard } from "./signin-card";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard"); // or wherever your app lands

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/60 bg-card/80 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Sign in
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Continue to your Docu Expiry workspace.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <AuthSignInCard />
        </CardContent>
      </Card>
    </div>
  );
}
