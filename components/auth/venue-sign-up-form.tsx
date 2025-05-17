'use client';

import * as React from "react";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FC, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "reactfire";
import { Eye, EyeOff, Check, X, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createVenueAccount } from "@/lib/venue-account-service";

const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" });

const formSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface VenueSignUpFormProps {
  onShowLogin: () => void;
  onSignUp?: () => void;
}

export const VenueSignUpForm: FC<VenueSignUpFormProps> = ({ onShowLogin, onSignUp }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [requirements, setRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false,
  });
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    setRequirements({
      minLength: passwordValue.length >= 8,
      hasNumber: /[0-9]/.test(passwordValue),
      hasSpecial: /[^a-zA-Z0-9]/.test(passwordValue),
    });
    if (confirmPasswordValue) {
      setPasswordsMatch(passwordValue === confirmPasswordValue);
    }
  }, [passwordValue, confirmPasswordValue]);

  const signUp = async ({ email, password }: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      // Step 1: Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Step 2: Create venue account in Supabase
      const venueAccount = await createVenueAccount({
        firebase_uid: user.uid,
        email: user.email || email,
      });
      if (!venueAccount || !venueAccount.id) {
        throw new Error("Failed to create venue account in Supabase. Please try again.");
      }
      toast({
        title: "Account created!",
        description: "You have been signed up and logged in.",
      });
      router.push('/venues');
    } catch (error: any) {
      if (error.code && error.code.includes("already")) {
        toast({ title: "Venue account already exists" });
      } else {
        toast({ title: "Error signing up", description: error?.message || `${error}` });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(signUp)}>
          <fieldset disabled={isLoading} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">Email Address</FormLabel>
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
                  <FormLabel className="text-sm text-foreground">Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          setPasswordValue(e.target.value);
                        }}
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
                  <div className="mt-2 space-y-1">
                    <PasswordRequirement 
                      met={requirements.minLength}
                      label="At least 8 characters"
                    />
                    <PasswordRequirement 
                      met={requirements.hasNumber}
                      label="At least one number"
                    />
                    <PasswordRequirement 
                      met={requirements.hasSpecial}
                      label="At least one special character"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">Confirm Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          setConfirmPasswordValue(e.target.value);
                        }}
                        className="bg-background"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  {confirmPasswordValue && (
                    <div className={cn(
                      "flex items-center mt-2 text-xs",
                      passwordsMatch ? "text-green-600" : "text-red-600"
                    )}>
                      {passwordsMatch ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1.5" />
                          <span>Passwords match</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5 mr-1.5" />
                          <span>Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
                  {!confirmPasswordValue && <FormMessage />}
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              size="lg" 
              className="w-full mt-2"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Create Venue Account
            </Button>
          </fieldset>
        </form>
      </Form>
      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Already have a venue account?{" "}
          <Button 
            variant="link" 
            onClick={onShowLogin}
            className="p-0 font-semibold text-primary hover:text-primary/80"
          >
            Sign in
          </Button>
        </p>
      </div>
    </>
  );
};

interface PasswordRequirementProps {
  met: boolean;
  label: string;
}

const PasswordRequirement: FC<PasswordRequirementProps> = ({ met, label }) => {
  return (
    <div className={cn(
      "flex items-center text-xs",
      met ? "text-green-600" : "text-muted-foreground"
    )}>
      {met ? (
        <Check className="w-3.5 h-3.5 mr-1.5" />
      ) : (
        <X className="w-3.5 h-3.5 mr-1.5" />
      )}
      {label}
    </div>
  );
}; 