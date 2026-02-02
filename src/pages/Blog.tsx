import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  created_at: string;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, slug, title, content, excerpt, image_url, created_at")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
  className="relative py-20 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2070&auto=format&fit=crop')",
  }}
>
  {/* Dark overlay for text readability */}
  <div className="absolute inset-0 bg-black/60"></div>

  <div className="relative container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center space-y-6 text-white">
      <h1 className="text-4xl md:text-5xl font-bold">Hiretek Blog</h1>
      <p className="text-xl text-white/90">
        Insights, tips, and trends from the world of recruitment and talent acquisition.
      </p>
    </div>
  </div>
</section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading blog posts...</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all group">
                  {post.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    {post.excerpt && (
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="ghost" className="w-full gap-2 group-hover:bg-primary/10">
                        Read More <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">Subscribe to Our Newsletter</h2>
              <p className="text-lg text-muted-foreground">
                Get the latest insights and tips delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button className="shrink-0">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Blog;
