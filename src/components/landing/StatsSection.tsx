import { Stethoscope, Target, HeartPulse, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  {
    icon: Stethoscope,
    value: "15+",
    label: "Diseases Predicted",
    description: "Comprehensive screening"
  },
  {
    icon: Target,
    value: "94%",
    label: "AI Accuracy",
    description: "Clinically validated"
  },
  {
    icon: HeartPulse,
    value: "100%",
    label: "Preventive Focus",
    description: "Early detection"
  },
  {
    icon: Users,
    value: "50K+",
    label: "Users Helped",
    description: "And growing"
  }
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted Health Intelligence
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI-powered platform delivers reliable health predictions backed by medical research.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-card border border-border card-hover"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-4">
                <stat.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">
                {stat.value}
              </div>
              <div className="text-base font-semibold text-card-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link to="/health-check" className="flex items-center gap-2">
              Start Free Assessment
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
