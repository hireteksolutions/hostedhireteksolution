import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PostJob = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user has employer or admin role
  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setIsCheckingRole(false);
        setHasPermission(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .in("role", ["employer", "admin"]);

        if (error) throw error;
        setHasPermission(data && data.length > 0);
      } catch (error) {
        console.error("Error checking user role:", error);
        setHasPermission(false);
      } finally {
        setIsCheckingRole(false);
      }
    };

    checkUserRole();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in as an employer to post a job.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!hasPermission) {
      toast({
        title: "Access denied",
        description: "Only employers and admins can post jobs.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const title = (formData.get("title") ?? "").toString().trim();
    const company = (formData.get("company") ?? "").toString().trim();
    const location = (formData.get("location") ?? "").toString().trim();
    const type = (formData.get("type") ?? "").toString();
    const salaryMinRaw = (formData.get("salary-min") ?? "").toString();
    const salaryMaxRaw = (formData.get("salary-max") ?? "").toString();
    const description = (formData.get("description") ?? "").toString();
    const requirements = (formData.get("requirements") ?? "").toString();

    const salaryMin = parseInt(salaryMinRaw, 10);
    const salaryMax = parseInt(salaryMaxRaw, 10);

    try {
      // Generate slug from title
      const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim().slice(0, 100) + '-' + Date.now().toString(36);
      
      const { error } = await supabase.from("jobs").insert([
        {
          title,
          company,
          location,
          type,
          salary_min: Number.isNaN(salaryMin) ? null : salaryMin,
          salary_max: Number.isNaN(salaryMax) ? null : salaryMax,
          description,
          requirements,
          employer_id: user.id,
          status: "active",
          slug,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your job has been posted successfully.",
      });
      navigate("/jobs");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to post job. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking role
  if (isCheckingRole) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-destructive" />
                Sign In Required
              </CardTitle>
              <CardDescription>You need to sign in to post a job</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please sign in with an employer account to post job listings.
                </AlertDescription>
              </Alert>
              <div className="mt-6">
                <Button onClick={() => navigate("/auth")}>Sign In</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // No permission
  if (!hasPermission) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-destructive" />
                Access Denied
              </CardTitle>
              <CardDescription>You don't have permission to post jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Only employers and administrators can post job listings. If you believe this is an error, please contact support.
                </AlertDescription>
              </Alert>
              <div className="mt-6 flex gap-4">
                <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
                <Button onClick={() => navigate("/jobs")}>Browse Jobs</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Post a New Job
            </CardTitle>
            <CardDescription>Fill in the details to create a job listing</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" name="title" placeholder="e.g. Senior React Developer" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" name="company" placeholder="Your company name" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="e.g. San Francisco, CA" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Job Type</Label>
                  <select id="type" name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required>
                    <option value="">Select type...</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary-min">Min Salary</Label>
                  <Input id="salary-min" name="salary-min" type="number" placeholder="50000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary-max">Max Salary</Label>
                  <Input id="salary-max" name="salary-max" type="number" placeholder="100000" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  placeholder="Describe the role, responsibilities, and what you're looking for..." 
                  rows={6}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea 
                  id="requirements"
                  name="requirements"
                  placeholder="List the required skills and qualifications..." 
                  rows={4}
                  required 
                />
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Job"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;
