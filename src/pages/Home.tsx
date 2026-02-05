import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatSalary } from "@/lib/salary-utils";
import JobCard from "@/components/JobCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Search,
  MapPin,
  Briefcase,
  Code,
  TrendingUp,
  Users,
  Building2,
  CheckCircle2,
  ArrowRight,
  Star,
  Sparkles,
  Zap,
  Award,
  Clock,
  Landmark,
  Settings, MessageSquare, Handshake
} from "lucide-react";
// import heroImage from "@/assets/hero-recruitment.jpg";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-recruitment.jpg";
import Havells from "@/assets/Havells.png"
import Panasonic from "@/assets/Panasonic.png"
import ust from "@/assets/ust.png"
import wipro from "@/assets/wipro.png"
import hul from "@/assets/hul.png"
import Godrej from "@/assets/Godrej.png"
import Rockworth from "@/assets/Rockworth-logo.png"
import Legrand from "@/assets/Legrand.png"
import Perperfry from "@/assets/Pepperfry.png"
import Vega from "@/assets/Vega.png"


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
  created_at: string;
}


const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const navigate = useNavigate();

const [open, setOpen] = useState(false);
const popularTags = ["Remote", "Full-time", "Tech", "Marketing", "Design"];

 const fetchFeaturedJobs = useCallback(async () => {
  const { data } = await supabase
    .from("jobs")
    .select(
      "id, slug, title, company, location, type, salary_min, salary_max, description, created_at"
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(3);

  if (data) setFeaturedJobs(data);
}, []);

useEffect(() => {
  fetchFeaturedJobs();
}, [fetchFeaturedJobs]);



  const categories = useMemo(() => [
    { icon: Code, name: " IT & Technology", color: "from-blue-500 to-cyan-500" },
    { icon: Landmark, name: "BFSI & FinTech" , color: "from-pink-500 to-rose-500"},
    { icon: TrendingUp, name: "Consulting & Strategy", color: "from-orange-500 to-amber-500" },
    { icon: Users, name: "Manufacturing & Engineering", color: "from-green-500 to-emerald-500" },
    { icon: Building2, name: " FMCG & Consumer", color: "from-purple-500 to-violet-500" },
    { icon: Briefcase, name: "Retail & Supply Chain", color: "from-indigo-500 to-blue-500" }, 
  ], []);

  const stats = useMemo(() => [
    { number: "100+", label: "Active Jobs" },
    { number: "50+", label: "Companies" },
    { number: "1000+", label: "Job Seekers" },
    { number: "85%", label: "Success Rate" },
  ], []);

  const howItWorks = useMemo(() => [
    {
      step: "1",
      title: "Create Your Profile",
      description: "Sign up and build your professional profile in minutes",
      icon: Users,
    },
    {
      step: "2",
      title: "Search Jobs",
      description: "Browse thousands of opportunities matching your skills",
      icon: Search,
    },
    {
      step: "3",
      title: "Apply Easily",
      description: "Submit applications with just a few clicks",
      icon: Zap,
    },
    {
      step: "4",
      title: "Get Hired",
      description: "Connect with employers and land your dream job",
      icon: Award,
    },
  ], []);

  const testimonials = useMemo(() => [
    {
      name: "Amit Verma",
      role: "Senior Software Engineer · Bengaluru, India",
      content: "I was actively searching for a job change for months, but Hiretek solutions made the process much simpler. The job listings are genuine and well-filtered. Within a few weeks, I started getting interview calls from relevant companies. Highly recommended for professionals in India looking for quality opportunities..",
      avatar: "AV",
    },
    {
      name: "Neha Sharma",
      role: "HR Manager · Mid-size IT Services Firm, Gurugram",
      content: "As a hiring manager, Hiretek has helped us reach relevant candidates much faster. The quality of applications is better compared to other platforms, and the dashboard makes it easy to manage job postings and track applicants. It has definitely streamlined our hiring process.",
      avatar: "NS",
    },
    {
      name: "Pooja Kulkarnis",
      role: "Sales Head · Pune",
      content: "Hiretek Solutions stands out because of its clean interface and genuine opportunities. I was able to find roles aligned with my skills and career goals without unnecessary spam or irrelevant listings. The support team is also responsive and helpful. A great platform for job seekers in India!",
      avatar: "PK",
    },
  ], []);

  const handleSearch = useCallback(() => {
    navigate(`/jobs?search=${searchTerm}&location=${location}`);
  }, [navigate, searchTerm, location]);

  const clientLogos = useMemo(() => [
    Havells,
    Panasonic,
    ust,
    wipro,
    hul,
    Godrej, 
    Rockworth, 
    Legrand, 
    Perperfry,
    Vega
  ], []);


  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
<section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
  {/* Animated Background */}
  <div
    className="absolute inset-0 bg-cover bg-center scale-105"
    style={{ backgroundImage: `url(${heroImage})` }}
  >
    {/* Overlay color reduced */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-primary/35 to-secondary/30" />
  </div>
  
  {/* Floating Elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse" />
    <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/15 rounded-full blur-2xl animate-pulse delay-700" />
    <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-1000" />
    <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-secondary/20 rounded-full blur-lg animate-pulse delay-500" />
  </div>

  <div className="container relative z-10 mx-auto px-4 py-24">
    <div className="max-w-4xl mx-auto text-center space-y-8">

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/10 animate-fade-in">
        <Sparkles className="h-4 w-4" />
        <span>#1 Job Platform for Professionals</span>
      </div>

      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight animate-fade-in">
        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-secondary-foreground">Dream Job</span> Today
      </h1>
      
      <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto animate-fade-in">
        Connect with leading companies and discover opportunities that match your skills and aspirations
      </p>

      {/* Search Bar */}
      <Card className="bg-background/90 backdrop-blur-md shadow-2xl border-0 animate-fade-in">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 border border-border rounded-xl bg-background hover:border-primary/50 transition-colors">
              <Search className="h-5 w-5 text-primary" />
              <Input
                placeholder="Job title or keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              />
            </div>

            <div className="flex-1 flex items-center gap-3 px-4 py-3 border border-border rounded-xl bg-background hover:border-primary/50 transition-colors">
              <MapPin className="h-5 w-5 text-primary" />
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              />
            </div>

            <Button size="lg" onClick={handleSearch} className="px-8 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Search className="mr-2 h-5 w-5" />
              Search Jobs
            </Button>
          </div>

          {/* Popular Searches */}
         <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50">
  <span className="text-sm text-muted-foreground">Popular:</span>
  {popularTags.map((tag) => (
    <button
      key={tag}
      onClick={() => setSearchTerm(tag)}
      className="px-3 py-1 text-sm bg-muted hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
    >
      {tag}
    </button>
  ))}
</div>

        </CardContent>
      </Card>

      {/* Quick Stats under hero */}
      <div className="flex flex-wrap justify-center gap-8 pt-8 animate-fade-in">
        {[
          { icon: CheckCircle2, text: "Verified Companies" },
          { icon: Clock, text: "Quick Apply" },
          { icon: Star, text: "Top-rated Platform" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-white/80">
            <item.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{item.text}</span>
          </div>
        ))}
      </div>

    </div>
  </div>
</section>


      {/* Trusted Companies */}
      {/* <section className="py-8 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <span className="text-sm text-muted-foreground font-medium">Trusted by leading companies:</span>
            <div className="flex flex-wrap justify-center gap-8">
              {trustedCompanies.map((company) => (
                <span key={company} className="text-lg font-semibold text-muted-foreground/70 hover:text-primary transition-colors cursor-pointer">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section> */}
  <section className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Clients</h2>
      <p className="text-lg text-muted-foreground">
        Trusted by leading companies worldwide
      </p>
    </div>

    {/* Carousel Wrapper */}
    <div className="overflow-hidden relative">
      <div
        className="flex whitespace-nowrap animate-slide"
        style={{ animation: "slide 15s linear infinite" }}
      >
        {clientLogos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt="client logo"
            className="h-16 w-auto inline-block mx-10 object-contain transition"
            loading="lazy"
            style={{
              filter: "none",
              opacity: 1,
            }}
          />
        ))}

        {/* Duplicate for continuous loop */}
        {clientLogos.map((logo, index) => (
          <img
            key={`dup-${index}`}
            src={logo}
            alt="client logo"
            className="h-16 w-auto inline-block mx-10 object-contain transition"
            loading="lazy"
            style={{
              filter: "none",
              opacity: 1,
            }}
          />
        ))}
      </div>
    </div>
  </div>
</section> 


      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-muted/20"
              >
                <CardContent className="p-6 text-center">
                  {/* <div className="h-12 w-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div> */}
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who We Serve</h2>
            <p className="text-lg text-muted-foreground">
              Hiretek partners with companies across all major industries
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group cursor-pointer border-0 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <CardContent className="p-6 text-center space-y-4 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className={`h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="relative">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                    {/* <p className="text-sm text-muted-foreground">{category.count}</p> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
            <div>
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Featured Opportunities
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Jobs</h2>
              <p className="text-lg text-muted-foreground">
                Hand-picked opportunities from top companies
              </p>
            </div>
            <Link to="/jobs">
              <Button variant="outline" size="lg" className="group">
                View All Jobs
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
             <JobCard
                key={job.id}
                slug={job.slug}
                title={job.title}
                company={job.company}
                location={job.location}
                type={job.type}
                 salary={
                  formatSalary(job.salary_min, job.salary_max)
                }
                description={job.description}
                posted={new Date(job.created_at).toLocaleDateString()}
              />
            ))}
          </div>
          
          {featuredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No jobs available yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to post a job opportunity!</p>
              <Button onClick={() => navigate("/post-job")}>Post a Job</Button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-medium mb-4">
              <Sparkles className="h-5 w-5" />
              Simple Process
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting started is easy - follow these simple steps to land your dream job
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative group">
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                )}
                
                <div className="text-center space-y-4 relative z-10">
                  <div className="h-24 w-24 mx-auto rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-primary font-medium mb-4">
              <Sparkles className="h-5 w-5" />
              Success Stories
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who found their dream jobs through Hiretek Solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground/80 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
   <section className="py-24 relative overflow-hidden">
  {/* SAME BACKGROUND AS YOUR CTA */}
  <div className="absolute inset-0 gradient-hero" />
  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_0%,_transparent_55%)]" />

  <div className="container mx-auto px-4 relative z-10">
    {/* Header */}
    <div className="max-w-3xl mx-auto text-center mb-20">
      <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium border border-white/20 mb-4">
        How It Works
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
        Simple 4-Step B2B Engagement Process
      </h2>
      <p className="text-white/80 text-lg">
        Partner with Hiretek Solutions to build efficient hiring, staffing, and
        talent acquisition workflows for your business.
      </p>
    </div>

    {/* Steps */}
    <div className="relative">
      {/* Connector Line */}
     <div className="hidden md:block absolute top-14 left-[8%] right-[8%] h-[2px] bg-white/40 rounded-full" />


      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Step 1 */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-24 h-24 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
           <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white text-primary text-sm font-bold flex items-center justify-center shadow-md">
  1
</span>

            <Users className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Share Your Requirements
          </h3>
          <p className="text-white/75 text-sm">
            Tell us about your hiring goals, workforce needs, or partnership
            objectives.
          </p>
        </div>

        {/* Step 2 */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-24 h-24 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white text-primary text-sm font-bold flex items-center justify-center shadow-md">
  2
</span>
            <Settings className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Solution Design
          </h3>
          <p className="text-white/75 text-sm">
            Our experts design a customized hiring or talent solution aligned
            with your business.
          </p>
        </div>

        {/* Step 3 */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-24 h-24 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white text-primary text-sm font-bold flex items-center justify-center shadow-md">
  3
</span>
            <MessageSquare className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Collaborate & Execute
          </h3>
          <p className="text-white/75 text-sm">
            Work closely with our team to implement, optimize, and scale the
            solution.
          </p>
        </div>

        {/* Step 4 */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-24 h-24 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white text-primary text-sm font-bold flex items-center justify-center shadow-md">
  4
</span>
            <Handshake className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Grow Together
          </h3>
          <p className="text-white/75 text-sm">
            Build long-term partnerships with measurable results and continuous
            improvement.
          </p>
        </div>
      </div>
    </div>

    {/* CTA */}
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <div className="flex justify-center mt-10">
  <Button
    size="lg"
    className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all hover:scale-105 px-10 py-6 text-lg font-semibold"
  >
    Partner With Hiretek Solutions
  </Button>
</div>

  </DialogTrigger>

  <DialogContent className="sm:max-w-[520px] rounded-2xl">
    <DialogHeader>
      <DialogTitle className="text-2xl text-center font-semibold">
        Partner With Hiretek Solutions
      </DialogTitle>
    </DialogHeader>

    <div className="space-y-5 mt-4">
      <div>
        <label className="text-sm font-medium">Company Name</label>
        <Input placeholder="Enter company name" />
      </div>

      <div>
        <label className="text-sm font-medium">Contact Number</label>
        <Input placeholder="10-digit mobile number" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="robot" />
        <label htmlFor="robot" className="text-sm">
          I am not a robot
        </label>
      </div>
    </div>

    <DialogFooter className="mt-6 flex justify-center gap-4">
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button className="bg-primary text-white">Submit</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

</div>
</section>

    </div>
  );
};

export default memo(Home);
