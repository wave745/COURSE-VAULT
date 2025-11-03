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
import { resendVerificationSchema, type ResendVerificationData } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation, useSearch } from "wouter";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";

export default function Verify() {
  const { toast } = useToast();
  const searchParams = new URLSearchParams(useSearch());
  const token = searchParams.get("token");
  const [vaultId, setVaultId] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const verifyMutation = useMutation({
    mutationFn: async (token: string) => {
      const res = await apiRequest("POST", "/api/auth/verify", { token });
      return res.json();
    },
    onSuccess: (data) => {
      setVaultId(data.vaultId);
      toast({
        title: "Email verified!",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate(token);
    }
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invalid Link</h1>
          <p className="text-muted-foreground mb-6">
            This verification link is invalid or malformed.
          </p>
          <Link href="/signup">
            <Button data-testid="button-go-to-signup">Go to Signup</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (verifyMutation.isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Verifying your email...</h1>
          <p className="text-muted-foreground">Please wait a moment.</p>
        </Card>
      </div>
    );
  }

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
      resendForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to resend email",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isExpired = verifyMutation.error?.message?.includes("expired") || 
                     (verifyMutation.error as any)?.expired === true;

  if (verifyMutation.isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-center">Verification Failed</h1>
          <p className="text-muted-foreground mb-6 text-center">
            {verifyMutation.error?.message || "Unable to verify your email."}
          </p>

          {isExpired && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Your verification link has expired. Request a new one below:
              </p>
              <Form {...resendForm}>
                <form 
                  onSubmit={resendForm.handleSubmit((data) => resendMutation.mutate(data))} 
                  className="space-y-4"
                >
                  <FormField
                    control={resendForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
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
                    disabled={resendMutation.isPending}
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
                </form>
              </Form>
            </div>
          )}

          <div className="flex gap-2">
            <Link href="/signup" className="flex-1">
              <Button variant="outline" className="w-full" data-testid="button-go-to-signup">
                Go to Signup
              </Button>
            </Link>
            {!isExpired && (
              <Link href="/login" className="flex-1">
                <Button variant="default" className="w-full">
                  Go to Login
                </Button>
              </Link>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
        <p className="text-muted-foreground mb-6">
          Your email has been successfully verified. You can now log in with your Vault ID.
        </p>

        {vaultId && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Your Vault ID</p>
            <p className="text-xl font-mono font-bold text-primary">{vaultId}</p>
          </div>
        )}

        <Link href="/login">
          <Button className="w-full" data-testid="button-go-to-login">
            Go to Login
          </Button>
        </Link>
      </Card>
    </div>
  );
}
