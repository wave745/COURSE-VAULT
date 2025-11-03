import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, resendVerificationSchema, type SignupData, type ResendVerificationData } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { UserPlus, Mail, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Signup() {
  const { toast } = useToast();
  const [vaultId, setVaultId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  const form = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      displayName: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      const res = await apiRequest("POST", "/api/auth/signup", data);
      return res.json();
    },
    onSuccess: (data) => {
      setVaultId(data.vaultId);
      setUserEmail(form.getValues("email"));
      toast({
        title: "Account created!",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resendForm = useForm<ResendVerificationData>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: "",
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (data: ResendVerificationData) => {
      const res = await apiRequest("POST", "/api/auth/resend-verification", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Email sent!",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to resend email",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignupData) => {
    signupMutation.mutate(data);
  };

  const handleResend = () => {
    resendForm.setValue("email", userEmail);
    resendMutation.mutate({ email: userEmail });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">
            Join the IUO Student Archive community
          </p>
        </div>

        {vaultId ? (
          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Vault ID</p>
              <p className="text-2xl font-mono font-bold text-primary mb-4">{vaultId}</p>
              <p className="text-sm text-muted-foreground">
                Save this ID! You'll use it to log in after verifying your email.
              </p>
            </div>
            
            <div className="bg-muted rounded-lg p-4 mb-4">
              <p className="text-sm mb-2">
                <strong>Next steps:</strong>
              </p>
              <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                <li>Check your email for a verification link</li>
                <li>Click the link to verify your account</li>
                <li>Log in using your Vault ID</li>
              </ol>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResend}
                disabled={resendMutation.isPending}
                data-testid="button-resend-email"
              >
                {resendMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>

              <Link href="/login">
                <Button className="w-full" data-testid="button-go-to-login">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        data-testid="input-email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        data-testid="input-display-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={signupMutation.isPending}
                data-testid="button-signup"
              >
                {signupMutation.isPending ? "Creating account..." : "Create Account"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login">
                  <span className="text-primary hover:underline cursor-pointer" data-testid="link-login">
                    Log in
                  </span>
                </Link>
              </div>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}
