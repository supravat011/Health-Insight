import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Activity, User, Plus, LogOut, FileText, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check auth status
    setIsAuthenticated(auth.isAuthenticated());
    const user = auth.getUser();
    if (user) {
      setUserName(user.name);
    }
  }, [location]);

  const handleLogout = async () => {
    await auth.logout();
    setIsAuthenticated(false);
    navigate("/");
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/health-check", label: "Health Check", protected: true },
    { path: "/dashboard", label: "Dashboard", protected: true },
  ];

  const visibleNavLinks = navLinks.filter(link => !link.protected || isAuthenticated);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-200 border-b border-white/10 ${scrolled
        ? "bg-primary shadow-lg py-3"
        : "bg-primary py-5"
        }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center bg-white text-primary rounded-sm transform group-hover:rotate-12 transition-transform duration-300">
            <Activity className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white uppercase">
            HEALTH<span className="font-light">INSIGHT</span>HUB
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {visibleNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-bold uppercase tracking-wide transition-colors duration-200 relative group ${location.pathname === link.path
                ? "text-white"
                : "text-white/80 hover:text-white"
                }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ${location.pathname === link.path ? "scale-x-100" : ""}`} />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                className="font-bold text-white hover:bg-white/10 hover:text-white rounded-none border border-transparent"
                asChild
              >
                <Link to="/health-check">
                  <Plus className="mr-2 h-4 w-4" /> New Assessment
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-none border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary font-bold">
                    <User className="mr-2 h-4 w-4" />
                    {userName || "Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/health-records" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      Health Records
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/prediction-history" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      Prediction History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold uppercase text-white hover:text-white/80 transition-colors mr-4">
                Log In
              </Link>
              <Button className="rounded-sm bg-white text-primary hover:bg-white/90 border-2 border-transparent shadow-md transition-all font-bold uppercase tracking-wide px-6" asChild>
                <Link to="/signup">
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-white hover:bg-white/10 transition-colors rounded"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-primary border-t border-white/10 p-0 animate-accordion-down shadow-xl">
          <nav className="flex flex-col">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-lg font-bold uppercase p-4 border-b border-white/10 hover:bg-white/10 text-white transition-colors ${location.pathname === link.path
                  ? "bg-white/10"
                  : ""
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  className="text-lg font-bold uppercase p-4 border-b border-white/10 hover:bg-white/10 text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/health-records"
                  className="text-lg font-bold uppercase p-4 border-b border-white/10 hover:bg-white/10 text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Health Records
                </Link>
                <Link
                  to="/prediction-history"
                  className="text-lg font-bold uppercase p-4 border-b border-white/10 hover:bg-white/10 text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Prediction History
                </Link>
              </>
            )}
            <div className="p-4">
              {isAuthenticated ? (
                <Button
                  className="w-full rounded-sm bg-white text-destructive font-bold uppercase py-6 shadow-none hover:bg-white/90"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              ) : (
                <Button className="w-full rounded-sm bg-white text-primary font-bold uppercase py-6 shadow-none hover:bg-white/90" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
