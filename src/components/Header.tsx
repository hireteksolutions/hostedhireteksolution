import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import Hiretek_Logo from "../assets/Hiretek_Logo.png";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={Hiretek_Logo}
            alt="Hiretek logo"
            className="h-16 w-17 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/jobs" className="text-sm font-medium hover:text-primary">
            Find Jobs
          </Link>
          <Link to="/services" className="text-sm font-medium hover:text-primary">
            Services
          </Link>
          <Link to="/blog" className="text-sm font-medium hover:text-primary">
            Blog
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary">
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>
              Find Jobs
            </Link>
            <Link to="/services" onClick={() => setMobileMenuOpen(false)}>
              Services
            </Link>
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)}>
              Blog
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
