import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="px-8 md:px-16 lg:px-24 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg hero-gradient">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">Health Insight Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered health risk prediction for early disease detection and preventive care.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/health-check" className="text-sm text-muted-foreground hover:text-primary">Health Check</Link></li>
              <li><Link to="/recommendations" className="text-sm text-muted-foreground hover:text-primary">Recommendations</Link></li>
              <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">About Us</span></li>
              <li><span className="text-sm text-muted-foreground">Contact</span></li>
              <li><span className="text-sm text-muted-foreground">Careers</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">Privacy Policy</span></li>
              <li><span className="text-sm text-muted-foreground">Terms of Service</span></li>
              <li><span className="text-sm text-muted-foreground">HIPAA Compliance</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Health Insight Hub. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            For informational purposes only. Not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
