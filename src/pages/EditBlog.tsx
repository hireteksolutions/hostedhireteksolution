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
import { Shield, AlertCircle, Loader2, Pencil, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  author_id: string;
  status: string;
}

const EditBlog = () => {
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (slug && user) {
      fetchBlogAndCheckPermission();
    } else if (!user) {
      setIsCheckingPermission(false);
    }
  }, [slug, user]);

  const fetchBlogAndCheckPermission = async () => {
    try {
      // Fetch blog - admins can view all, others only published
      const { data: blogData, error: blogError } = await supabase
        .from("blogs")
        .select("id, slug, title, content, excerpt, image_url, author_id, status")
        .eq("slug", slug)
        .maybeSingle();

      if (blogError) throw blogError;
      if (!blogData) {
        navigate("/blog");
        return;
      }
      setBlog(blogData);
      setImagePreview(blogData.image_url);

      // Check if user is admin or the blog owner
      const { data: roles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .in("role", ["admin"]);

      if (roleError) throw roleError;

      const isAdmin = roles && roles.length > 0;
      const isOwner = blogData.author_id === user!.id;

      setHasPermission(isAdmin || isOwner);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to load blog details.",
        variant: "destructive",
      });
      navigate("/blog");
    } finally {
      setIsCheckingPermission(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB.",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!blog || !user) return;

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = (formData.get("title") ?? "").toString().trim();
    const excerpt = (formData.get("excerpt") ?? "").toString().trim();
    const content = (formData.get("content") ?? "").toString();
    const status = (formData.get("status") ?? "draft").toString();

    try {
      let imageUrl = blog.image_url;

      // Upload new image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("blog_images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("blog_images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase
        .from("blogs")
        .update({
          title,
          excerpt: excerpt || null,
          content,
          image_url: imageUrl,
          status,
        })
        .eq("id", blog.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Blog has been updated successfully.",
      });
      navigate(`/blog/${blog.slug}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update blog. Please try again.";
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
              <CardDescription>You need to sign in to edit this blog</CardDescription>
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
              <CardDescription>You don't have permission to edit this blog</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Only the blog author or administrators can edit this post.
                </AlertDescription>
              </Alert>
              <div className="mt-6 flex gap-4">
                <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
                <Button onClick={() => navigate("/blog")}>Browse Blogs</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Edit Blog Post
            </CardTitle>
            <CardDescription>Update the blog post details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={blog.title} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (optional)</Label>
                <Textarea 
                  id="excerpt"
                  name="excerpt"
                  defaultValue={blog.excerpt ?? ""}
                  rows={2}
                  placeholder="A brief summary of the blog post..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content"
                  name="content"
                  defaultValue={blog.content}
                  rows={12}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Featured Image</Label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">Choose Image</span>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="h-16 w-24 object-cover rounded-md" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Max file size: 5MB</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  name="status" 
                  defaultValue={blog.status}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
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

export default EditBlog;
