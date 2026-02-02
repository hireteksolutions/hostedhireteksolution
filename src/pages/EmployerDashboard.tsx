import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, FileText, Eye, Trash2, Download, ExternalLink, PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  status: string;
  created_at: string;
}

interface Application {
  id: string;
  applicant_name: string;
  email: string;
  phone: string;
  resume_url: string | null;
  status: string;
  created_at: string;
  job_id: string;
  jobs: {
    title: string;
  };
}

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
}

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    image_url: "",
    status: "draft",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => app.status === statusFilter));
    }
  }, [statusFilter, applications]);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to view this page",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Fetch jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .eq("employer_id", user.id)
        .order("created_at", { ascending: false });

      if (jobsError) throw jobsError;
      setJobs(jobsData || []);

      // Fetch applications
      const { data: appsData, error: appsError } = await supabase
        .from("applications")
        .select(`
          *,
          jobs!inner (
            title,
            employer_id
          )
        `)
        .eq("jobs.employer_id", user.id)
        .order("created_at", { ascending: false });

      if (appsError) throw appsError;
      setApplications(appsData || []);
      setFilteredApplications(appsData || []);

      // Fetch blogs
      const { data: blogsData, error: blogsError } = await supabase
        .from("blogs")
        .select("*")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      if (blogsError) throw blogsError;
      setBlogs(blogsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application status updated",
      });

      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;

    try {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job deleted successfully",
      });

      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleJobStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "closed" : "active";
    
    try {
      const { error } = await supabase
        .from("jobs")
        .update({ status: newStatus })
        .eq("id", jobId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Job ${newStatus === "active" ? "activated" : "closed"}`,
      });

      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const downloadResume = async (resumeUrl: string, applicantName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(resumeUrl);

      if (error) throw error;

      // Create a download link
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${applicantName}_resume.${resumeUrl.split('.').pop()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Resume downloaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to download resume",
        variant: "destructive",
      });
    }
  };

  const viewResume = async (resumeUrl: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(resumeUrl, 60); // 60 seconds expiry

      if (error) throw error;

      // Open in new tab
      window.open(data.signedUrl, '_blank');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to view resume",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingImage(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from("blog_images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("blog_images")
        .getPublicUrl(fileName);

      setBlogForm({ ...blogForm, image_url: publicUrl });
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const submitBlog = async () => {
    if (!blogForm.title || !blogForm.content) {
      toast({
        title: "Error",
        description: "Please fill in title and content",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("blogs")
        .insert({
          author_id: user.id,
          title: blogForm.title,
          excerpt: blogForm.excerpt || null,
          content: blogForm.content,
          image_url: blogForm.image_url || null,
          status: blogForm.status,
          slug: blogForm.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim().slice(0, 100) + '-' + Date.now().toString(36),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post created successfully",
      });

      setBlogForm({
        title: "",
        excerpt: "",
        content: "",
        image_url: "",
        status: "draft",
      });
      setShowBlogForm(false);
      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", blogId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });

      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleBlogStatus = async (blogId: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    
    try {
      const { error } = await supabase
        .from("blogs")
        .update({ status: newStatus })
        .eq("id", blogId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Blog ${newStatus === "published" ? "published" : "saved as draft"}`,
      });

      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const stats = [
    {
      title: "Active Jobs",
      value: jobs.filter(j => j.status === "active").length,
      icon: Briefcase,
    },
    {
      title: "Total Applications",
      value: applications.length,
      icon: Users,
    },
    {
      title: "Pending Review",
      value: applications.filter(a => a.status === "pending").length,
      icon: FileText,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Employer Dashboard</h1>
        <p className="text-muted-foreground">Manage your job postings and applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="jobs">My Job Postings</TabsTrigger>
          <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Applications</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredApplications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No applications found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.applicant_name}</TableCell>
                          <TableCell>{app.jobs.title}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{app.email}</div>
                              {app.phone && <div className="text-muted-foreground">{app.phone}</div>}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(app.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                app.status === "accepted"
                                  ? "default"
                                  : app.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {app.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {app.resume_url ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => viewResume(app.resume_url!)}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadResume(app.resume_url!, app.applicant_name)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">No resume</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={app.status}
                              onValueChange={(value) => updateApplicationStatus(app.id, value)}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="reviewed">Reviewed</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Job Postings</CardTitle>
                <Button onClick={() => navigate("/post-job")}>
                  Post New Job
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No jobs posted yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Posted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{job.type}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(job.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={job.status === "active" ? "default" : "secondary"}>
                              {job.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/jobs/${job.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleJobStatus(job.id, job.status)}
                              >
                                {job.status === "active" ? "Close" : "Activate"}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteJob(job.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blogs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Blog Posts</CardTitle>
                <Button onClick={() => setShowBlogForm(!showBlogForm)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {showBlogForm ? "Cancel" : "New Blog Post"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showBlogForm && (
                <Card className="mb-6">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        placeholder="Enter blog title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                        placeholder="Short description (optional)"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                        placeholder="Write your blog content"
                        rows={8}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image_upload">Blog Image</Label>
                      <div className="space-y-2">
                        <Input
                          id="image_upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                        {uploadingImage && (
                          <p className="text-sm text-muted-foreground">Uploading image...</p>
                        )}
                        {blogForm.image_url && (
                          <div className="mt-2">
                            <img 
                              src={blogForm.image_url} 
                              alt="Preview" 
                              className="h-32 w-auto rounded-md object-cover"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => setBlogForm({ ...blogForm, image_url: "" })}
                            >
                              Remove Image
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={blogForm.status}
                        onValueChange={(value) => setBlogForm({ ...blogForm, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={submitBlog} className="w-full">
                      Submit Blog Post
                    </Button>
                  </CardContent>
                </Card>
              )}

              {blogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No blog posts yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogs.map((blog) => (
                        <TableRow key={blog.id}>
                          <TableCell className="font-medium">{blog.title}</TableCell>
                          <TableCell>
                            <Badge variant={blog.status === "published" ? "default" : "secondary"}>
                              {blog.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(blog.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleBlogStatus(blog.id, blog.status)}
                              >
                                {blog.status === "published" ? "Unpublish" : "Publish"}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteBlog(blog.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployerDashboard;
