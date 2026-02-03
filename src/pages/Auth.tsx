import { useState, useEffect, useCallback, memo, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // ✅ FIX: redirect logged-in users to dashboard, NOT home
  useEffect(() => {
    if (!loading && user) {
      navigate("/employer-dashboard");
    }
  }, [loading, user, navigate]);

  const handleSubmit = useCallback(async (
    e: FormEvent<HTMLFormElement>,
    type: "signin" | "signup",
  ) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") ?? "").toString().trim();
    const password = (formData.get("password") ?? "").toString();

    const validation = credentialsSchema.safeParse({ email, password });
    if (!validation.success) {
      setIsLoading(false);
      toast({
        title: "Invalid input",
        description: validation.error.issues[0]?.message ?? "Please check your details",
        variant: "destructive",
      });
      return;
    }

    try {
      if (type === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Signed in",
          description: "You've been signed in successfully.",
        });

        navigate("/employer-dashboard");
      } else {
        const fullName = (formData.get("fullName") ?? "").toString().trim();
        const role = (formData.get("role") ?? "").toString();

        if (!fullName || !role) {
          setIsLoading(false);
          toast({
            title: "Missing information",
            description: "Please fill in your name and select a role.",
            variant: "destructive",
          });
          return;
        }

        const redirectUrl = `${window.location.origin}/`;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
              role,
            },
          },
        });

        if (error) throw error;

        toast({
          title: "Account created",
          description: "Please check your email to confirm your account.",
        });

        navigate("/employer-dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message ?? "Something went wrong during authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, navigate]);

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            {/* <TabsTrigger value="signup">Sign Up</TabsTrigger> */}
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Sign in to your account to continue</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, "signin")} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Get started with your job search or hiring</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, "signup")} className="space-y-4">
                  <Input name="fullName" placeholder="Full Name" required />
                  <Input name="email" type="email" required />
                  <Input name="password" type="password" required />
                  <select name="role" required className="w-full h-10 border rounded-md px-3">
                    <option value="">Select role...</option>
                    <option value="job_seeker">Job Seeker</option>
                    <option value="employer">Employer</option>
                  </select>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </main>
  );
};

export default memo(Auth);
