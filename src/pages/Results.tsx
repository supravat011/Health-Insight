import { useLocation, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Heart, Activity, Scale, Droplets } from "lucide-react";

interface RiskScore {
  disease: string;
  score: number;
  icon: React.ElementType;
}

const getRiskLevel = (score: number) => {
  if (score <= 30) return { label: "Low Risk", color: "text-risk-low", bgColor: "bg-risk-low" };
  if (score <= 60) return { label: "Medium Risk", color: "text-risk-medium", bgColor: "bg-risk-medium" };
  return { label: "High Risk", color: "text-risk-high", bgColor: "bg-risk-high" };
};

const CircularProgress = ({ score, size = 120 }: { score: number; size?: number }) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const riskLevel = getRiskLevel(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={riskLevel.color}
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold ${riskLevel.color}`}>{score}</span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  );
};

const Results = () => {
  const location = useLocation();
  const state = location.state as any;

  // Get prediction data from backend
  const prediction = state?.prediction;
  const explanation = state?.explanation;

  if (!prediction) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No prediction data available</h2>
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

  // Map backend risks to display format
  const riskScores: RiskScore[] = [
    { disease: "Diabetes", score: prediction.risks.diabetes, icon: Droplets },
    { disease: "Heart Disease", score: prediction.risks.heart_disease, icon: Heart },
    { disease: "Obesity", score: prediction.risks.obesity, icon: Scale },
  ];

  const overallScore = Math.round(prediction.overall_risk_score);
  const overallRisk = getRiskLevel(overallScore);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Overall Score Card */}
          <div className="rounded-2xl bg-card border border-border p-8 shadow-lg mb-8 text-center">
            <h1 className="text-2xl font-bold text-card-foreground mb-2">
              Your Health Risk Assessment
            </h1>
            <p className="text-muted-foreground mb-8">
              Based on the information you provided, here's your health risk analysis
            </p>

            <div className="flex flex-col items-center mb-6">
              <CircularProgress score={overallScore} size={160} />
              <div className={`mt-4 px-4 py-2 rounded-full ${overallRisk.bgColor}/20`}>
                <span className={`font-semibold ${overallRisk.color}`}>
                  {overallRisk.label}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              This score represents your overall health risk level based on multiple factors.
              Lower scores indicate better health outcomes.
            </p>
          </div>

          {/* Individual Disease Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {riskScores.map((risk) => {
              const riskLevel = getRiskLevel(risk.score);
              return (
                <div
                  key={risk.disease}
                  className="rounded-2xl bg-card border border-border p-6 card-hover"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${riskLevel.bgColor}/20`}>
                        <risk.icon className={`h-6 w-6 ${riskLevel.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">
                          {risk.disease}
                        </h3>
                        <span className={`text-sm ${riskLevel.color}`}>
                          {riskLevel.label}
                        </span>
                      </div>
                    </div>
                    <CircularProgress score={risk.score} size={80} />
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${riskLevel.bgColor} transition-all duration-1000`}
                      style={{ width: `${risk.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/recommendations" state={{ prediction, explanation }}>
                View Recommendations
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <Download className="h-5 w-5" />
              Download Report
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 rounded-xl bg-muted/50 text-center">
            <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> This assessment is for informational purposes only
              and should not be considered medical advice. Please consult with a healthcare
              professional for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
