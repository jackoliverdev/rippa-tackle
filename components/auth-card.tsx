"use client";

import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "reactfire";

export const AuthCard = () => {
  const [isShowingSignUp, setIsShowingSignUp] = useState<boolean>(false);
  const { data: user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.email === "jackoliverdev@gmail.com") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    }
  }, [user, router]);
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">
            {isShowingSignUp ? "Create Your Account" : "Sign In to Rippa Tackle"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isShowingSignUp
              ? "Join Rippa Tackle to track orders, save favourites and get exclusive offers."
              : "Sign in to access your account, view past orders and manage your details."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isShowingSignUp ? (
            <SignUpForm onShowLogin={() => setIsShowingSignUp(false)} />
          ) : (
            <SignInForm onShowSignUp={() => setIsShowingSignUp(true)} />
          )}
        </CardContent>
      </Card>
    </>
  );
};
