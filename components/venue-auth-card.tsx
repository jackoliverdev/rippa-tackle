"use client";

import { VenueSignInForm } from "@/components/auth/venue-sign-in-form";
import { VenueSignUpForm } from "@/components/auth/venue-sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export const VenueAuthCard = () => {
  const [isShowingSignUp, setIsShowingSignUp] = useState<boolean>(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          {isShowingSignUp ? "Create Your Venue Account" : "Sign In to Venue Portal"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {isShowingSignUp
            ? "Register your venue to start managing your profile and bookings."
            : "Sign in to access your venue dashboard and manage your venue profile."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isShowingSignUp ? (
          <VenueSignUpForm onShowLogin={() => setIsShowingSignUp(false)} />
        ) : (
          <VenueSignInForm onShowSignUp={() => setIsShowingSignUp(true)} />
        )}
      </CardContent>
    </Card>
  );
}; 