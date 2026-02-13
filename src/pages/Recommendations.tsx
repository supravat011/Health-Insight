import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  Apple,
  Dumbbell,
  Moon,
  Heart,
  Droplet,
  Activity,
  Salad,
  Coffee,
  Stethoscope,
} from "lucide-react";

const iconMap: Record<string, any> = {
  Salad, Coffee, Droplet, Activity, Dumbbell, Moon, Heart, Apple, Stethoscope
};

const Recommendations = () => {
  const location = useLocation();
  const state = location.state as any;
  const prediction = state?.prediction;

  if (!prediction || !prediction.recommendations) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No recommendations available</h2>
            <p className="text-muted-foreground mb-6">Please complete a health check first</p>
            <Button variant="hero" asChild>
              <Link to="/health-check">Start Health Check</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const recommendations = [
    {
      category: "Diet",
      icon: Apple,
      color: "bg-success/20 text-success",
      tips: prediction.recommendations.diet || [],
    },
    {
      category: "Exercise",
      icon: Dumbbell,
      color: "bg-accent/20 text-accent",
      tips: prediction.recommendations.exercise || [],
    },
    {
      category: "Lifestyle",
      icon: Heart,
      color: "bg-warning/20 text-warning",
      tips: prediction.recommendations.lifestyle || [],
    },
    {
      category: "Medical",
      icon: Stethoscope,
      color: "bg-destructive/20 text-destructive",
      tips: prediction.recommendations.medical || [],
    },
  ].filter(cat => cat.tips.length > 0);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Personalized Health Recommendations
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Based on your health assessment, here are tailored recommendations
              to help you improve your health and reduce risk factors.
            </p>
          </div>

          {/* Recommendation Categories */}
          <div className="space-y-8">
            {recommendations.map((category) => (
              <div key={category.category} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {category.category} Recommendations
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {category.tips.map((tip: string, index: number) => (
                    <div
                      key={index}
                      className="rounded-2xl bg-card border border-border p-6 card-hover"
                    >
                      <div className={`inline-flex p-3 rounded-xl ${category.color} mb-4`}>
                        <category.icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-card-foreground">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips Section */}
          <div className="mt-12 rounded-2xl hero-gradient p-8 text-center">
            <h3 className="text-2xl font-bold text-primary-foreground mb-4">
              Take Action Today
            </h3>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Small changes lead to big results. Start with one recommendation
              from each category and build healthy habits gradually.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-background text-primary hover:bg-background/90"
                asChild
              >
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/health-check">Take Another Assessment</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Recommendations;
