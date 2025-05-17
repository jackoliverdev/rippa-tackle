'use client';

import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FC, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "reactfire";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ModalForgotPassword } from "@/components/auth/modal-forgot-password";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

interface SignInFormProps {
  onShowSignUp: () => void;
}

// Helper to map Firebase errors to friendly messages
function getFriendlyAuthError(error: any): string {
  if (!error || !error.code) return "An unknown error occurred. Please try again.";
  switch (error.code) {
    case "auth/user-not-found":
      return "No account found with that email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait and try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    default:
      return "Unable to sign in. Please check your details and try again.";
  }
}

export const SignInForm: FC<SignInFormProps> = ({ onShowSignUp }) => {
  const auth = useAuth();
  const router = useRouter();
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = async ({ email, password }: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Success!",
        description: "You have been signed in.",
      });
      // Admin redirect
      if (email.toLowerCase() === "jackoliverdev@gmail.com") {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } catch (error: any) {
      toast({
        title: "Error Signing In",
        description: getFriendlyAuthError(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(login)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="name@example.com" 
                    {...field} 
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      {...field} 
                      className="bg-background"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="link" 
              size="sm" 
              onClick={() => setIsResetOpen(true)}
              className="px-0 font-normal text-xs text-muted-foreground"
            >
              Forgot password?
            </Button>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full"
            size="lg"
          >
            <LogIn className="mr-2 h-4 w-4" /> 
            Sign In
          </Button>
        </form>
      </Form>
      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Don't have an account?{" "}
          <Button 
            variant="link" 
            onClick={onShowSignUp}
            className="p-0 font-semibold text-primary hover:text-primary/80"
          >
            Sign up instead
          </Button>
        </p>
      </div>
      <ModalForgotPassword isOpen={isResetOpen} setIsOpen={setIsResetOpen} />
    </>
  );
};
