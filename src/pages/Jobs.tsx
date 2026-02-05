import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import JobCard from "@/components/JobCard";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatSalary } from "@/lib/salary-utils";

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

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Filter jobs based on search term and location
  useEffect(() => {
    const filtered = allJobs.filter((job) => {
      const matchesSearch = searchTerm === "" || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = location === "" ||
        job.location.toLowerCase().includes(location.toLowerCase());
      
      return matchesSearch && matchesLocation;
    });
    setFilteredJobs(filtered);
  }, [searchTerm, location, allJobs]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Select only public-facing columns, excluding employer_id for security
      const { data, error } = await supabase
        .from("jobs")
        .select("id, slug, title, company, location, type, salary_min, salary_max, description, created_at")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAllJobs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Executive"];
  const industries = ["Technology", "Finance", "Healthcare", "Education", "Marketing"];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Search Header */}
      <section className="py-8 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Find Your Perfect Job</h1>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 px-4 py-2 border border-border rounded-md bg-background">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Job title, keywords, or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-2 border border-border rounded-md bg-background">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="City, state, or zip code"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button size="lg">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className={`lg:w-80 ${showFilters ? "" : "hidden lg:block"}`}>
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-2">
                    <Label>Sort By</Label>
                    <Select defaultValue="recent">
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="relevant">Most Relevant</SelectItem>
                        <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                        <SelectItem value="salary-low">Salary: Low to High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Job Type */}
                  <div className="space-y-3">
                    <Label>Job Type</Label>
                    {jobTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={type} />
                        <label
                          htmlFor={type}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-3">
                    <Label>Experience Level</Label>
                    {experienceLevels.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox id={level} />
                        <label
                          htmlFor={level}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Industry */}
                  <div className="space-y-3">
                    <Label>Industry</Label>
                    {industries.map((industry) => (
                      <div key={industry} className="flex items-center space-x-2">
                        <Checkbox id={industry} />
                        <label
                          htmlFor={industry}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {industry}
                        </label>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full">
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Job Listings */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredJobs.length}</span> jobs
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-muted-foreground">No jobs found matching your criteria</p>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    slug={job.slug}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    type={job.type}
                    salary={formatSalary(job.salary_min, job.salary_max)}
                    description={job.description}
                    posted={new Date(job.created_at).toLocaleDateString()}
                  />
                  ))
                )}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="default" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Jobs;
