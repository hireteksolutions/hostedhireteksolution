import { memo, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Award, TrendingUp, Shield, Zap, Handshake, Star, MapPin, Briefcase, Building2, CheckCircle2, Sparkles } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const About = () => {
  const coreValues = useMemo(() => [
    {
      icon: Shield,
      title: "Integrity",
      description:
        "We operate with complete transparency and an ethical commitment to both clients and candidates. Trust is our currency.",
    },
    {
      icon: Target,
      title: "Specialization",
      description:
        "We don't aim to be a generalist. Our strength lies in deep vertical knowledge, ensuring we understand the nuances of the roles and industries we serve.",
    },
    {
      icon: Handshake,
      title: "Partnership",
      description:
        "We believe in long-term relationships over transactional placements. We are invested in your sustained success.",
    },
    {
      icon: Star,
      title: "Excellence",
      description:
        "We are committed to delivering exceptional service, meticulously screening candidates, and offering strategic consultation.",
    },
  ], []);

  const comparisonData = useMemo(() => [
    {
      feature: "Expertise",
      hiretek: "Deep Vertical Focus: Recruiters are experts in specific tech stacks and industries.",
      traditional: "Generalist approach, often lacking niche understanding.",
    },
    {
      feature: "Sourcing",
      hiretek: "Proactive & Network-Driven: We tap into passive talent through exclusive networks and proprietary research.",
      traditional: "Primarily relies on job boards and active applicants.",
    },
    {
      feature: "Consultation",
      hiretek: "Strategic Partner: Offers market insights, salary benchmarking, and organizational advice.",
      traditional: "Focuses mainly on filling open roles quickly.",
    },
    {
      feature: "Commitment",
      hiretek: "Quality over Quantity: Focused on cultural fit and long-term retention metrics.",
      traditional: "High volume, fast placements.",
    },
  ], []);

  const industries = useMemo(() => [
    "Technology & Software (SaaS, FinTech, CyberSecurity)",
    "Engineering (Hardware, Aerospace, R&D)",
    "Digital Transformation & Consulting",
    "Data & Analytics",
  ], []);

  const roles = useMemo(() => [
    "C-Suite & Leadership (CTO, VP Engineering)",
    "Software Architects & Principal Engineers",
    "Data Scientists & AI/ML Experts",
    "Product Management & Technical Sales",
  ], []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
    <section className="py-20 gradient-hero relative overflow-hidden ">
  {/* Background Shapes */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse " />
    <div className="absolute bottom-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
  </div>

  {/* Image */}
  <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-10">
    <div className="flex-1">
      <img 
        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7" 
        alt="Team collaboration" 
        className="rounded-2xl shadow-xl w-full object-cover"
        loading="lazy"
      />
    </div>

    {/* Text Content */}
    <div className="flex-1 text-center md:text-left space-y-6">
      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm">
        <Sparkles className="h-4 w-4" />
        Your Strategic Talent Partner
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
        Our Story
      </h1>
      <p className="text-xl text-white/90 leading-relaxed">
        At Hiretek, our journey began with a simple yet powerful conviction: 
        the traditional recruitment model wasn't working for the dynamic world 
        of technology and specialized industries. Founded by a team of industry 
        veterans, we set out to build a recruitment firm that operates not as a 
        vendor, but as a genuine strategic partner.
      </p>
    </div>
  </div>
</section>


      {/* Vision & Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary font-medium mb-4">
              <Sparkles className="h-5 w-5" />
              Vision & Mission
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Driving Innovation Through Talent
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the leading specialized talent consultancy recognized for deep market 
                  expertise, ethical practices, and the transformative placements we facilitate.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To connect visionary organizations with exceptional, specialized talent that 
                  drives innovation and growth, while empowering candidates to achieve their 
                  full professional potential.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary font-medium mb-4">
              <Star className="h-5 w-5" />
              Our Journey & Core Values
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Guides Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Since our inception, Hiretek has grown from a specialized startup into a respected 
              name in tech and niche sector recruitment. This journey has been guided by a set 
              of unwavering Core Values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {coreValues.map((value, index) => (
              <Card key={index} className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-transparent hover:border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary font-medium mb-4">
              <Target className="h-5 w-5" />
              What Makes Hiretek Different?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              A Fundamentally Different Approach
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              In a crowded recruitment landscape, Hiretek stands out by offering excellence at every step.
            </p>
          </div>

          <div className="max-w-5xl mx-auto overflow-hidden rounded-xl border shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-bold text-base py-4">Feature</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-base py-4">The Hiretek Difference</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-base py-4">Traditional Model</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-semibold text-foreground py-4">{row.feature}</TableCell>
                    <TableCell className="text-muted-foreground py-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{row.hiretek}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4 opacity-70">{row.traditional}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Whom We Serve Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary font-medium mb-4">
              <Users className="h-5 w-5" />
              Whom We Serve
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Precision Hiring Across Critical Sectors
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We pride ourselves on our highly specialized focus, allowing us to deliver precision 
              hiring across critical sectors and locations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Industries */}
            <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Industries</h3>
                <ul className="space-y-3">
                  {industries.map((industry, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <span className="text-sm">{industry}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Roles */}
            <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Roles</h3>
                <ul className="space-y-3">
                  {roles.map((role, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <span className="text-sm">{role}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Locations */}
            <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Locations</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We manage assignments across <strong className="text-foreground">PAN India</strong> with 
                  a proven track record of successful placements in major tech hubs and emerging markets.
                </p>
                <div className="mt-4 flex items-center gap-2 text-primary">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Nationwide Coverage</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary font-medium mb-4">
              <Award className="h-5 w-5" />
              Our Commitment
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              To Clients & Candidates
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* To Clients */}
            <Card className="bg-gradient-to-br from-primary/5 via-background to-primary/10 border-primary/20 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
                  <Building2 className="h-4 w-4" />
                  To Our Clients
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We commit to delivering a streamlined, consultative, and efficient hiring process. 
                  We understand that the right talent is the single most important factor in achieving 
                  your business goals.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We promise to present only thoroughly vetted candidates who not only possess the 
                  technical skills but also align with your organizational culture.
                </p>
              </CardContent>
            </Card>

            {/* To Candidates */}
            <Card className="bg-gradient-to-br from-secondary/5 via-background to-secondary/10 border-secondary/20 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium mb-6">
                  <Users className="h-4 w-4" />
                  To Our Candidates
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We view you as professionals, not commodities. We commit to respectful, confidential, 
                  and strategic career guidance.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We promise to listen to your aspirations, only present opportunities that genuinely 
                  advance your career, and provide transparent communication every step of the way.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse delay-700" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-xl text-white/90">
              Hiretek is more than just a firm; we are the dedicated engine driving your next 
              big career move or your company's next wave of innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-all duration-300 hover:scale-105"
              >
                Get Started Today
              </a>
              <a 
                href="/jobs" 
                className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Browse Opportunities
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(About);
