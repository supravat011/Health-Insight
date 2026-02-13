import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { Link } from "react-router-dom";
import {
  Plus,
  TrendingDown,
  TrendingUp,
  Calendar,
  Activity,
  Heart,
  Scale,
  Droplets,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

const getRiskColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "low":
      return "bg-risk-low text-white border-transparent";
    case "medium":
      return "bg-risk-medium text-black border-transparent";
    case "high":
      return "bg-risk-high text-white border-transparent";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const diseaseIcons: Record<string, React.ElementType> = {
  Diabetes: Droplets,
  "Heart Disease": Heart,
  Obesity: Scale,
  diabetes: Droplets,
  heart_disease: Heart,
  obesity: Scale,
};

const Dashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);

    // Fetch stats and timeline in parallel
    const [statsResponse, timelineResponse] = await Promise.all([
      apiClient.getDashboardStats(),
      apiClient.getDashboardTimeline(),
    ]);

    if (statsResponse.data) {
      setStats(statsResponse.data);
    } else {
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    }

    if (timelineResponse.data) {
      setTimeline(timelineResponse.data.timeline || []);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
        <Header />
        <main className="flex-1 py-32 px-4 md:px-8 relative flex items-center justify-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!stats || !stats.latest_prediction) {
    return (
      <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
        <Header />
        <main className="flex-1 py-32 px-4 md:px-8 relative">
          <div className="container mx-auto max-w-7xl text-center">
            <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No health data yet</h2>
            <p className="text-muted-foreground mb-6">Start your first health assessment</p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/health-check">
                <Plus className="h-5 w-5 mr-2" />
                Start Health Check
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const latestPrediction = stats.latest_prediction;
  const riskDetails = [
    { disease: "Diabetes", score: latestPrediction.risks.diabetes },
    { disease: "Heart Disease", score: latestPrediction.risks.heart_disease },
    { disease: "Obesity", score: latestPrediction.risks.obesity },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Header />
      <main className="flex-1 py-32 px-4 md:px-8 relative">
        <div className="container mx-auto max-w-7xl space-y-12">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-border pb-8">
            <div>
              <h1 className="text-6xl font-bold mb-2 tracking-tighter text-foreground uppercase">
                Health <span className="text-stroke text-transparent bg-clip-text" style={{ WebkitTextStroke: "1px black" }}>Dashboard</span>
              </h1>
              <p className="text-muted-foreground text-xl max-w-lg font-medium">
                Overview of your vital health metrics.
              </p>
            </div>
            <Button size="lg" className="rounded-none h-14 px-8 bg-black hover:bg-primary text-white font-bold uppercase tracking-wide shadow-hard hover:translate-x-1 hover:-translate-y-1 transition-all border-2 border-transparent" asChild>
              <Link to="/health-check">
                <Plus className="h-5 w-5 mr-2" />
                New Analysis
              </Link>
            </Button>
          </div>

          {/* Current Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {riskDetails.map((detail, index) => {
              const Icon = diseaseIcons[detail.disease] || Activity;
              const riskLevel = detail.score <= 30 ? "Low" : detail.score <= 60 ? "Medium" : "High";
              const riskColor = getRiskColor(riskLevel);

              return (
                <GlassCard
                  key={detail.disease}
                  hoverEffect
                  className="relative group border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-hard"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 border-2 border-black ${riskLevel === 'High' ? 'bg-risk-high text-white' : 'bg-secondary text-primary'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className={`px-3 py-1 text-xs font-bold uppercase ${riskColor}`}>
                      {riskLevel}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-bold uppercase text-muted-foreground tracking-wide">{detail.disease}</p>
                    <div className="flex items-baseline gap-1">
                      <h3 className="text-5xl font-bold tracking-tighter text-foreground">
                        {Math.round(detail.score)}
                      </h3>
                      <span className="text-lg font-bold text-muted-foreground">/100</span>
                    </div>
                  </div>

                  <div className="w-full bg-secondary h-4 mt-6 border border-black relative">
                    <div
                      className="h-full bg-primary absolute top-0 left-0"
                      style={{ width: `${detail.score}%` }}
                    />
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Assessment History */}
          {timeline.length > 0 && (
            <div className="border-2 border-black bg-white shadow-hard">
              <div className="p-6 border-b-2 border-black bg-secondary flex items-center justify-between">
                <h2 className="text-2xl font-bold uppercase flex items-center gap-3">
                  <Calendar className="h-6 w-6" />
                  Assessment History
                </h2>
                <Button variant="outline" size="sm" className="rounded-none border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors" asChild>
                  <Link to="/prediction-history">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="divide-y-2 divide-black">
                {timeline.slice(0, 3).map((assessment: any) => (
                  <div
                    key={assessment.id}
                    className="p-6 hover:bg-secondary/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                      {/* Date & Score */}
                      <div className="flex-1 min-w-[250px]">
                        <div className="flex items-center gap-6">
                          <div className="h-16 w-16 bg-black text-white flex items-center justify-center font-bold text-2xl border-2 border-black group-hover:bg-primary transition-colors">
                            {Math.round(assessment.overall_risk_score)}
                          </div>
                          <div>
                            <p className="font-bold text-xl text-foreground">
                              {new Date(assessment.date).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-3 text-sm mt-1">
                              <span
                                className={`px-2 py-0.5 text-xs font-bold uppercase border ${getRiskColor(
                                  assessment.risk_category
                                ).replace('border-transparent', 'border-black')}`}
                              >
                                {assessment.risk_category} Risk
                              </span>
                              {assessment.trend === "improving" ? (
                                <span className="flex items-center gap-1 text-success font-bold uppercase text-xs">
                                  <TrendingDown className="h-4 w-4" /> Improving
                                </span>
                              ) : assessment.trend === "worsening" ? (
                                <span className="flex items-center gap-1 text-destructive font-bold uppercase text-xs">
                                  <TrendingUp className="h-4 w-4" /> Attention
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mini Progress Bars */}
                      <div className="flex-[2] grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-bold uppercase truncate pr-2">
                              Diabetes
                            </span>
                            <span className="font-black text-foreground">
                              {Math.round(assessment.risks.diabetes)}
                            </span>
                          </div>
                          <div className="h-2 bg-secondary border border-black/20">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${assessment.risks.diabetes}%` }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-bold uppercase truncate pr-2">
                              Heart
                            </span>
                            <span className="font-black text-foreground">
                              {Math.round(assessment.risks.heart_disease)}
                            </span>
                          </div>
                          <div className="h-2 bg-secondary border border-black/20">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${assessment.risks.heart_disease}%` }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-bold uppercase truncate pr-2">
                              Obesity
                            </span>
                            <span className="font-black text-foreground">
                              {Math.round(assessment.risks.obesity)}
                            </span>
                          </div>
                          <div className="h-2 bg-secondary border border-black/20">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${assessment.risks.obesity}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <ArrowRight className="h-6 w-6 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
