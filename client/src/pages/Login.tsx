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
import { loginSchema, type LoginData } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { LogIn } from "lucide-react";

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      vaultId: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            Log in with your Vault ID
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="vaultId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vault ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VLT-XXXX-XXXX"
                      className="font-mono text-center text-lg tracking-wider uppercase"
                      data-testid="input-vault-id"
                      maxLength={13}
                      {...field}
                      onChange={(e) => {
                        // Auto-format Vault ID: VLT-XXXX-XXXX
                        let value = e.target.value.toUpperCase();
                        
                        // Remove all non-alphanumeric characters except dashes
                        value = value.replace(/[^A-F0-9-]/g, '');
                        
                        // If user is typing, format as they type
                        if (value.startsWith('VLT')) {
                          // Remove existing dashes and reformat
                          const cleaned = value.replace(/-/g, '').replace(/^VLT/, '');
                          if (cleaned.length <= 8) {
                            value = 'VLT-' + cleaned.slice(0, 4);
                            if (cleaned.length > 4) {
                              value += '-' + cleaned.slice(4, 8);
                            }
                          } else {
                            value = 'VLT-' + cleaned.slice(0, 4) + '-' + cleaned.slice(4, 8);
                          }
                        } else if (value.length > 0) {
                          // If no VLT prefix, add it
                          const cleaned = value.replace(/-/g, '');
                          if (cleaned.length <= 11) {
                            value = 'VLT-' + cleaned.slice(0, 4);
                            if (cleaned.length > 4) {
                              value += '-' + cleaned.slice(4, 8);
                            }
                          }
                        }
                        
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              {loginMutation.isPending ? "Logging in..." : "Log In"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup">
                <span className="text-primary hover:underline cursor-pointer" data-testid="link-signup">
                  Sign up
                </span>
              </Link>
            </div>
          </form>
        </Form>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Your Vault ID was sent to your email after signup. 
            Make sure to verify your email before logging in.
          </p>
        </div>
      </Card>
    </div>
  );
}
