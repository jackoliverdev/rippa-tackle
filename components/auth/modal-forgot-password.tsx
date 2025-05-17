import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from "reactfire";

interface ModalChangePasswordProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const ModalForgotPassword: FC<ModalChangePasswordProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your inbox and follow the instructions to reset your password.",
      });
      setIsOpen(false);
    } catch (error) {
      toast({ 
        title: "Error",
        description: "Failed to send reset email. Please check your email address and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you instructions to reset your password.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                disabled={isLoading}
                name="email"
                type="email"
                placeholder="name@example.com"
                className="bg-background"
                required
              />
            </div>

            <p className="text-sm text-muted-foreground">
              We'll send a secure link to reset your password.
            </p>
            
            <Button 
              disabled={isLoading || !email} 
              onClick={() => onSubmit()}
              className="w-full"
            >
              Send Reset Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
