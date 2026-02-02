import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, ArrowLeft, Clock, Share2, Twitter, Linkedin, Facebook, Link2, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  created_at: string;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readProgress, setReadProgress] = useState(0);
  const { toast } = useToast();

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (slug) {
      fetchBlog();
      fetchRelatedPosts();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, slug, title, content, excerpt, image_url, created_at")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) throw error;
      setBlog(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, slug, title, content, excerpt, image_url, created_at")
        .eq("status", "published")
        .neq("slug", slug)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setRelatedPosts(data || []);
    } catch (error) {
      console.error("Failed to fetch related posts:", error);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || "";
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "The URL has been copied to your clipboard." });
    } else {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-3xl px-4">
          <div className="h-64 bg-muted rounded-xl" />
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="space-y-3 mt-8">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
            <span className="text-4xl">📄</span>
          </div>
          <h1 className="text-2xl font-bold">Blog post not found</h1>
          <p className="text-muted-foreground">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog">
            <Button variant="default" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(blog.content);

  return (
    <div className="min-h-screen">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground truncate max-w-[200px]">{blog.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative">
        {blog.image_url ? (
          <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
            <img
              src={blog.image_url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="container mx-auto max-w-4xl">
                <Badge variant="secondary" className="mb-4">Featured Article</Badge>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{blog.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10 border-2 border-background">
                      <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">Admin</span>
                  </div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-4xl">
              <Badge variant="secondary" className="mb-4">Featured Article</Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{blog.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">Admin</span>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Social Share Floating Sidebar - Desktop */}
            <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-40">
              <span className="text-xs text-muted-foreground font-medium mb-2 rotate-[-90deg] origin-center translate-x-[-8px]">Share</span>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => handleShare("twitter")}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => handleShare("linkedin")}>
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => handleShare("facebook")}>
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => handleShare("copy")}>
                <Link2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none dark:prose-invert">
              {blog.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p 
                    key={index} 
                    className={`text-foreground/80 leading-relaxed mb-6 ${index === 0 ? 'first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-primary' : ''}`}
                  >
                    {paragraph}
                  </p>
                )
              ))}
            </article>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t">
              <Badge variant="outline">Career Tips</Badge>
              <Badge variant="outline">Job Search</Badge>
              <Badge variant="outline">Professional Growth</Badge>
            </div>

            {/* Mobile Share Buttons */}
            <div className="lg:hidden flex items-center justify-center gap-3 mt-8 py-6 border-t border-b">
              <span className="text-sm text-muted-foreground font-medium mr-2">Share:</span>
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleShare("twitter")}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleShare("linkedin")}>
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleShare("facebook")}>
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleShare("copy")}>
                <Link2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Author Bio */}
            <div className="mt-12 p-6 md:p-8 bg-muted/50 rounded-2xl">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">A</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Written by</p>
                  <h3 className="text-xl font-bold mb-2">Admin</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our team of career experts and industry professionals share insights, tips, and strategies to help you succeed in your career journey. Stay tuned for more valuable content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Continue Reading</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`}>
                    <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      {post.image_url ? (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <span className="text-4xl">📝</span>
                        </div>
                      )}
                      <CardContent className="p-5">
                        <p className="text-xs text-muted-foreground mb-2">
                          {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <Link to="/blog">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to All Articles
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
