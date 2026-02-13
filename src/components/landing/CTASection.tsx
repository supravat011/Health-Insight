import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-12 hero-gradient">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Take the First Step Towards Better Health
        </h2>
        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
          Join thousands of users who have discovered potential health risks early
          and taken proactive steps to improve their wellbeing.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="xl"
            className="bg-background text-primary hover:bg-background/90"
            asChild
          >
            <Link to="/health-check">
              Start Free Assessment
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="xl"
            variant="outline"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link to="/signup">
              Create Account
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
