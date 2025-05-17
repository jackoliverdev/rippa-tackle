import { AuthCard } from "@/components/auth-card";
import { ProviderLoginButtons } from "@/components/auth/provider-login-buttons";
import { OrSeparator } from "@/components/ui/or-separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Rippa Tackle",
  description: "Sign in to your Rippa Tackle account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background pt-12">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto px-4 sm:px-0 space-y-4">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading text-foreground">
              Customer Account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to track your orders, save your favourite products, and more.
            </p>
          </div>
          <AuthCard />
          <div className="space-y-4">
            <OrSeparator />
            <ProviderLoginButtons />
          </div>
          <div className="text-center text-xs text-muted-foreground font-body">
            By signing in, you agree to our {" "}
            <a href="/legal/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and {" "}
            <a href="/legal/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
