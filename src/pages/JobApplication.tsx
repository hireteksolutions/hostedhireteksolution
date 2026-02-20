import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const applicationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  coverLetter: z.string().trim().max(2000, "Cover letter must be less than 2000 characters").optional(),
});

const JobApplication = () => {
  const { slug } = useParams();
  const [jobId, setJobId] = useState<string | null>(null);

  // Fetch job ID from slug
  useEffect(() => {
    const fetchJobId = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("jobs")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (data) {
        setJobId(data.id);
      }
    };
    fetchJobId();
  }, [slug]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive",
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "File must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const firstName = formData.get("firstName")?.toString() ?? "";
      const lastName = formData.get("lastName")?.toString() ?? "";
      const email = formData.get("email")?.toString() ?? "";
      const phone = formData.get("phone")?.toString() ?? "";
      const coverLetter = formData.get("coverLetter")?.toString() ?? "";

      const validation = applicationSchema.safeParse({
        firstName,
        lastName,
        email,
        phone,
        coverLetter,
      });

      if (!validation.success) {
        toast({
          title: "Invalid input",
          description: validation.error.issues[0]?.message ?? "Please check your details",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!selectedFile) {
        toast({
          title: "Resume required",
          description: "Please upload your resume",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Upload resume
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Submit application (no auth required)
      const { error: insertError } = await supabase.from("applications").insert({
        job_id: jobId,
        applicant_name: `${firstName} ${lastName}`,
        email,
        phone,
        cover_letter: coverLetter || null,
        resume_url: filePath,
        status: "pending",
      });

      if (insertError) throw insertError;

      toast({
        title: "Application Submitted!",
        description: "Your application has been sent successfully. We'll be in touch soon.",
      });
      setTimeout(() => navigate("/jobs"), 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message ?? "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Apply for Position</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below to submit your application
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">Resume * (PDF or DOCX)</Label>
                  <div 
                    onClick={handleUploadClick}
                    className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                  >
                    {selectedFile ? (
                      <>
                        <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium text-foreground">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click to change file
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF or DOCX (max 5MB)
                        </p>
                      </>
                    )}
                    <Input
                      ref={fileInputRef}
                      id="resume"
                      type="file"
                      accept=".pdf,.docx"
                      className="hidden"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                  <Textarea
                    id="coverLetter"
                    name="coverLetter"
                    placeholder="Tell us why you're a great fit for this position..."
                    rows={6}
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="lg" 
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;
