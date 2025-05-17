'use client';

import * as React from "react";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
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
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

interface VenueSignInFormProps {
  onShowSignUp: () => void;
}

export const VenueSignInForm: FC<VenueSignInFormProps> = ({ onShowSignUp }) => {
  const auth = useAuth();
  const router = useRouter();
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
      router.push('/venues');
    } catch (error: any) {
      toast({
        title: "Error Signing In",
        description: error?.message || "Unable to sign in. Please check your details and try again.",
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
          Not a venue member?{" "}
          <Button 
            variant="link" 
            onClick={onShowSignUp}
            className="p-0 font-semibold text-primary hover:text-primary/80"
          >
            Sign up instead
          </Button>
        </p>
      </div>
    </>
  );
}; 