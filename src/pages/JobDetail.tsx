import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Briefcase,
  Clock,
  Building2,
  Heart,
  Share2,
  Pencil,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  created_at: string;
  employer_id: string;
}

const JobDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchJob();
    }
  }, [slug]);

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, slug, title, company, location, type, salary_min, salary_max, description, requirements, created_at, employer_id")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        navigate("/jobs");
        return;
      }
      setJob(data);

      // Check if user can edit (is owner or admin)
      if (user) {
        const isOwner = data.employer_id === user.id;
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .in("role", ["admin"]);
        
        const isAdmin = roles && roles.length > 0;
        setCanEdit(isOwner || isAdmin);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load job details.",
        variant: "destructive",
      });
      navigate("/jobs");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-8 space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span className="font-medium">{job.company}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {canEdit && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => navigate(`/jobs/${job.slug}/edit`)}
                          title="Edit Job"
                        >
                          <Pencil className="h-5 w-5" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon">
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary" className="flex items-center gap-1 py-2 px-4">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </Badge>
                    <Badge variant="outline" className="py-2 px-4">{job.type}</Badge>
                    <Badge variant="outline" className="py-2 px-4">
                      {job.salary_min && job.salary_max
                        ? `₹${job.salary_min}L - ₹${job.salary_max}L`
                        : "Competitive"}
                    </Badge>
                    <Badge variant="outline" className="py-2 px-4 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">About the Role</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>

                <Separator />

                {/* Requirements */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {job.requirements}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Apply Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => navigate(`/apply/${job.slug}`)}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">About {job.company}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {job.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {job.type}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
