import { Brain, Activity, Gauge, Heart, Sparkles, ClipboardList } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const features = [
  {
    icon: Brain,
    title: "AI-Based Prediction",
    description: "Our advanced machine learning models analyze your health data to predict potential disease risks with high accuracy.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Activity,
    title: "Multi-Disease Detection",
    description: "Screen for multiple conditions including diabetes, heart disease, obesity, and hypertension in a single assessment.",
    color: "from-emerald-500 to-green-500"
  },
  {
    icon: Gauge,
    title: "Health Risk Score",
    description: "Get a clear, easy-to-understand risk score from 0-100 that helps you visualize your overall health status.",
    color: "from-orange-500 to-amber-500"
  },
  {
    icon: Heart,
    title: "Personalized Advice",
    description: "Receive tailored health advice based on your specific risk factors, lifestyle, and health goals.",
    color: "from-rose-500 to-pink-500"
  },
  {
    icon: ClipboardList,
    title: "Comprehensive Reports",
    description: "Download detailed reports of your health assessments to share with your healthcare provider.",
    color: "from-violet-500 to-purple-500"
  },
  {
    icon: Sparkles,
    title: "Preventive Care Focus",
    description: "Focus on prevention with early detection and actionable steps to improve your health outcomes.",
    color: "from-indigo-500 to-blue-500"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="mb-20 max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-6 uppercase">
            Comprehensive <br />
            <span className="text-primary">Intelligence.</span>
          </h2>
          <div className="h-2 w-32 bg-accent" />
          <p className="mt-8 text-xl text-muted-foreground font-medium max-w-2xl">
            We combine medical expertise with advanced AI to deliver precise, actionable health insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-border">
          {features.map((feature, index) => (
            <GlassCard
              key={index}
              hoverEffect
              className="border-b border-r border-border hover:z-10 bg-transparent hover:bg-secondary/50 group"
            >
              <div className="mb-8">
                <feature.icon className="h-10 w-10 text-primary group-hover:text-accent transition-colors duration-300" />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4 uppercase tracking-wide group-hover:translate-x-2 transition-transform duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
