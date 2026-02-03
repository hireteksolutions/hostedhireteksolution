import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, AlertCircle, Loader2, Pencil } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Job {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_min: number | null;
  salary_max: number | null;
  description: string;
  requirements: string;
  employer_id: string;
}

const EditJob = () => {
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (slug && user) {
      fetchJobAndCheckPermission();
    } else if (!user) {
      setIsCheckingPermission(false);
    }
  }, [slug, user]);

  const fetchJobAndCheckPermission = async () => {
    try {
      // Fetch job
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("id, slug, title, company, location, type, salary_min, salary_max, description, requirements, employer_id")
        .eq("slug", slug)
        .maybeSingle();

      if (jobError) throw jobError;
      if (!jobData) {
        navigate("/jobs");
        return;
      }
      setJob(jobData);

      // Check if user is admin or the job owner
      const { data: roles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .in("role", ["admin"]);

      if (roleError) throw roleError;

      const isAdmin = roles && roles.length > 0;
      const isOwner = jobData.employer_id === user!.id;

      setHasPermission(isAdmin || isOwner);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to load job details.",
        variant: "destructive",
      });
      navigate("/jobs");
    } finally {
      setIsCheckingPermission(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!job || !user) return;

    setIsLoading(true);

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
      const { error } = await supabase
        .from("jobs")
        .update({
          title,
          company,
          location,
          type,
          salary_min: Number.isNaN(salaryMin) ? null : salaryMin,
          salary_max: Number.isNaN(salaryMax) ? null : salaryMax,
          description,
          requirements,
        })
        .eq("id", job.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Job has been updated successfully.",
      });
      navigate(`/jobs/${job.slug}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update job. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingPermission) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

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
              <CardDescription>You need to sign in to edit this job</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please sign in to continue.
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
              <CardDescription>You don't have permission to edit this job</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Only the job owner or administrators can edit this listing.
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

  if (!job) return null;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Edit Job
            </CardTitle>
            <CardDescription>Update the job listing details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" name="title" defaultValue={job.title} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" name="company" defaultValue={job.company} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" defaultValue={job.location} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Job Type</Label>
                  <select 
                    id="type" 
                    name="type" 
                    defaultValue={job.type}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                    required
                  >
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
                  <Label htmlFor="salary-min">Min Salary (in Lakhs)</Label>
                  <Input 
                    id="salary-min" 
                    name="salary-min" 
                    type="number" 
                    defaultValue={job.salary_min ?? ""} 
                    placeholder="e.g. 5"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary-max">Max Salary (in Lakhs)</Label>
                  <Input 
                    id="salary-max" 
                    name="salary-max" 
                    type="number" 
                    defaultValue={job.salary_max ?? ""} 
                    placeholder="e.g. 10"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  defaultValue={job.description}
                  rows={6}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea 
                  id="requirements"
                  name="requirements"
                  defaultValue={job.requirements}
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
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
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

export default EditJob;
