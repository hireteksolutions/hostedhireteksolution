import { Link } from "react-router-dom";
import { Briefcase, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import Hiretek_Logo from '../assets/Hiretek_Logo.png';
const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
               <img 
      src={Hiretek_Logo} 
      alt="Hiretek Solutions Logo" 
      className="h-12 w-auto" 
    />
              {/* <span className="text-xl font-bold text-foreground">Hiretek Solutions</span> */}
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting talented professionals with leading companies worldwide.
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/company/hiretek-solutions/" className="text-muted-foreground hover:text-primary transition-smooth">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/hiretek.in" className="text-muted-foreground hover:text-primary transition-smooth">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Career Advice
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Resume Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Salary Guide
                </a>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Recruitment Solutions
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Advertise with Us
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Contact
                </Link>
              </li>
              <li>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Hiretek solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
