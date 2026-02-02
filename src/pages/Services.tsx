import { useState, useMemo, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { 
  Briefcase, Users, Target, TrendingUp, CheckCircle, 
  Star, FileText, Search, MessageSquare, Award, Sparkles
} from "lucide-react";

import Havells from "@/assets/Havells.png"
import Panasonic from "@/assets/Panasonic.png"
import ust from "@/assets/ust.png"
import wipro from "@/assets/wipro.png"
import hul from "@/assets/hul.png"

const Services = () => {

  const services = useMemo(() => [
    {
      icon: Briefcase,
      title: "Tailored Recruitment Solutions",
      description: " Hiretek Solutions designs custom recruitment strategies that align with your business model, team structure, and long-term growth plans",
      features: ["Role-specific hiring strategies", "Rapid scaling support for new teams", "Dedicated recruiters for volume or niche hiring", "Customized interview frameworks & evaluation grids"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Leadership Hiring (CXO, Director & Senior Roles)",
      description: "Our executive search team specializes in identifying impact-driven leaders who strengthen organizational capability and lead with vision",
      features: ["CXOs & Business Heads", "Directors & VPs", " Product & Technology Leaders", "Transformation & Strategy Roles"],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Target,
      title: "Recruitment Services",
      description: "We provide end-to-end recruitment solutions designed to support growingorganizations.",
      features: ["Mid & Senior-Level Hiring", "Specialized & Niche Talent Acquisition", "Bulk & Volume Hiring", "Campus & Early Talent Hiring","Recruitment Process Outsourcing"],
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Make data-driven hiring decisions with advanced analytics and reporting.",
      features: ["Hiring metrics", "Performance tracking", "Custom reports", "Market insights"],
      gradient: "from-green-500 to-emerald-500"
    }
  ], []);
  
  const clientLogos = useMemo(() => [
    Havells,
    Panasonic,
    ust,
    wipro,
    hul
  ], []);

  const processSteps = useMemo(() => [
    {
      step: 1,
      icon: FileText,
      title: "Share Your Details",
      description: "Upload your resume and career info in minutes"
    },
    {
      step: 2,
      icon: Search,
      title: "Resume Enhancement",
      description: "We rewrite & design a powerful, ATS-friendly resume"
    },
    {
      step: 3,
      icon: MessageSquare,
      title: "Review & Feedback",
      description: "Collaborate with experts for perfect results"
    },
    {
      step: 4,
      icon: Award,
      title: "Get Hired Faster",
      description: "Impress recruiters and unlock job opportunities"
    }
  ], []);

  const testimonials = useMemo(() => [
    {
      name: "Rohit Mehta",
      role: "Head of Talent Acquisition",
      company: "IT Services Company",
      content: "Hiretek Solutions has been a reliable hiring partner for us. Their understanding of our requirements and quick turnaround time helped us close multiple critical roles faster than expected. The candidate quality was strong, and the coordination throughout the process was smooth and transparent.",
      rating: 4
    },
    {
      name: "Ananya Kapoor",
      role: "HR Manager",
      company: "Leading FMCG Brand",
      content: "Working with Hiretek Solutions significantly simplified our hiring process. They provided well-screened candidates aligned with both skill and culture fit. It saved our team a lot of time and effort.",
      rating: 5
    },
    {
      name: "Vikram Singh",
      role: "Talent Acquisition Lead",
      company: "FinTech",
      content: "Hiretek's structured approach and industry understanding make them stand out. From requirement gathering to final closure, the experience was professional and result-driven. We've seen a clear improvement in our hiring efficiency.",
      rating: 4
    }
  ], []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-24">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Trusted by 10,000+ Companies Worldwide
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Recruitment Solutions
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                Built for Success
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              From job posting to talent acquisition, our comprehensive suite of tools helps you find, attract, and hire the best candidates faster than ever.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {[
                { value: "98%", label: "Satisfaction Rate" },
                { value: "1000+", label: "Active Candidates" },
                { value: "60%", label: "Faster Hiring" },
              
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-medium mb-4">
              <Sparkles className="h-5 w-5" />
              Our Services
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Hire</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive recruitment solutions designed to streamline your hiring process from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0 bg-card"
              >
                <CardHeader className="pb-4">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    {/* <Badge variant="secondary" className="text-xs">{service.stats}</Badge> */}
                  </div>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`h-5 w-5 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center shrink-0 mt-0.5`}>
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {/* <Button variant="ghost" className="mt-6 group/btn">
                    Learn More 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

      {/* Process Flow */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-medium mb-4">
              <Sparkles className="h-5 w-5" />
              How It Works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple 4-Step Process (Resume Services) </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and transform your resume to stand out in every job application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            
            {processSteps.map((step, index) => (
              <div key={index} className="relative text-center group">
                <div className="relative z-10 mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-20 h-20 rounded-full bg-card shadow-lg flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      
      {/* <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Flexible pricing options to fit businesses of all sizes. Save 20% with annual billing.
            </p>
            
            Billing Toggle
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm ${!isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>Monthly</span>
              <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
              <span className={`text-sm ${isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                Annual <Badge variant="secondary" className="ml-2">Save 20%</Badge>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                  tier.popular ? 'border-primary shadow-xl scale-105 md:scale-110 z-10' : 'hover:shadow-lg'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader className={tier.popular ? 'pt-12' : ''}>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">
                      ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                    {isAnnual && (
                      <p className="text-sm text-primary mt-1">
                        Billed annually (${tier.annualPrice * 12}/year)
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        {feature.included ? (
                          <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/50 shrink-0" />
                        )}
                        <span className={feature.included ? 'text-foreground' : 'text-muted-foreground/50'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={tier.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-medium mb-4">
              <Sparkles className="h-5 w-5" />
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied companies who have transformed their hiring process.
            </p>
          </div>

          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2 pl-4">
                  <Card className="h-full">
                    <CardContent className="p-8">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                      <div className="flex items-center gap-4">
                        {/* <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        /> */}
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Trusted Companies */}
 

      {/* FAQ Section */}
      {/* <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our services and pricing.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {category.category === "Pricing" && <BarChart3 className="h-5 w-5 text-primary" />}
                  {category.category === "Features" && <Zap className="h-5 w-5 text-primary" />}
                  {category.category === "Support" && <HeadphonesIcon className="h-5 w-5 text-primary" />}
                  {category.category}
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Limited Time Offer
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join over 10,000 companies that trust TalentHub to build their dream teams. Start your free 14-day trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2 text-lg px-8">
                Start Free Trial <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 bg-transparent text-white border-white hover:bg-white/10">
                <HeadphonesIcon className="h-5 w-5" /> Book a Demo
              </Button>
            </div>
            <p className="text-white/70 text-sm">
              No credit card required • Cancel anytime • 24/7 support
            </p>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default memo(Services);
