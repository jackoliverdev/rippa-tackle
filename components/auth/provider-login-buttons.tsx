"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { FC, useState } from "react";
import { useAuth } from "reactfire";
import { useRouter } from "next/navigation";

interface Props {
  onSignIn?: () => void;
}

export const ProviderLoginButtons: FC<Props> = ({ onSignIn }) => {
  const auth = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const doProviderSignIn = async (provider: GoogleAuthProvider) => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, provider);
      // create user in your database here
      toast({ 
        title: "Signed in!", 
        description: "Welcome to Rippa Tackle."
      });
      
      // Admin redirect
      if (result.user.email?.toLowerCase() === "jackoliverdev@gmail.com") {
        router.push('/admin');
      } else {
        router.push('/account');
      }
      
      onSignIn?.();
    } catch (err: any) {
      console.error(err);
      toast({ 
        title: "Sign in failed", 
        description: "There was a problem signing in with Google. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Button
        className="w-full bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 flex items-center justify-center font-medium shadow-sm"
        disabled={isLoading}
        onClick={async () => {
          const provider = new GoogleAuthProvider();
          await doProviderSignIn(provider);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 48 48"
          className="mr-2"
        >
          <g>
            <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.61l6.85-6.85C35.63 2.36 30.23 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.2C12.36 13.98 17.73 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.36 46.1 24.55z"/>
            <path fill="#FBBC05" d="M10.67 28.29a14.5 14.5 0 0 1 0-8.58l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.49l7.98-6.2z"/>
            <path fill="#EA4335" d="M24 48c6.23 0 11.44-2.06 15.25-5.6l-7.19-5.6c-2.01 1.35-4.59 2.15-8.06 2.15-6.27 0-11.64-4.48-13.33-10.49l-7.98 6.2C6.71 42.18 14.82 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </g>
        </svg>
        Continue with Google
      </Button>
    </>
  );
};
