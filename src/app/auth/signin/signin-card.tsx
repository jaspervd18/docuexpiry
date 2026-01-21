"use client";

import { signIn } from "next-auth/react";

import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { SocialAuthButton } from "../social-auth-button";
import { GoogleIcon } from "~/components/icon/google";

export function AuthSignInCard() {
  return (
    <div className="space-y-4">
      <SocialAuthButton
        provider="google"
        label="Continue with Google"
        icon={<GoogleIcon />}
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      />

      <SocialAuthButton
        provider="microsoft"
        label="Continue with Microsoft"
        icon={
          <div className="h-5 w-5 rounded-sm bg-muted text-xs font-bold text-muted-foreground flex items-center justify-center">
            M
          </div>
        }
        disabled
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-muted-foreground">
            or sign in with email
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Input type="email" placeholder="Email (coming soon)" disabled />
        <Input type="password" placeholder="Password (coming soon)" disabled />

        <p className="text-xs text-muted-foreground">
          Email/password authentication will be available soon.
        </p>
      </div>
    </div>
  );
}
