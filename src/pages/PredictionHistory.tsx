import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

const PredictionHistory = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [predictions, setPredictions] = useState<any[]>([]);

    useEffect(() => {
        loadPredictions();
    }, []);

    const loadPredictions = async () => {
        setIsLoading(true);
        const response = await apiClient.getPredictions(1, 20);

        if (response.data) {
            setPredictions(response.data.predictions || []);
        } else {
            toast({
                title: "Error",
                description: "Failed to load prediction history",
                variant: "destructive",
            });
        }
        setIsLoading(false);
    };

    const getRiskColor = (category: string) => {
        switch (category.toLowerCase()) {
            case "low":
                return "bg-risk-low text-white";
            case "medium":
                return "bg-risk-medium text-black";
            case "high":
                return "bg-risk-high text-white";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 py-12 flex items-center justify-center">
                    <p className="text-muted-foreground">Loading predictions...</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Prediction History</h1>
                        <p className="text-muted-foreground">View all your health risk assessments</p>
                    </div>

                    {predictions.length === 0 ? (
                        <div className="text-center py-12">
                            <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No predictions yet</h2>
                            <p className="text-muted-foreground mb-6">Start your first health assessment</p>
                            <Button variant="hero" asChild>
                                <Link to="/health-check">Start Health Check</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {predictions.map((prediction) => (
                                <div
                                    key={prediction.id}
                                    className="rounded-2xl bg-card border border-border p-6 card-hover"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                        {/* Date & Score */}
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl rounded-xl">
                                                {Math.round(prediction.overall_risk_score)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <p className="font-semibold text-card-foreground">
                                                        {new Date(prediction.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getRiskColor(prediction.risk_category)}`}>
                                                    {prediction.risk_category} Risk
                                                </div>
                                            </div>
                                        </div>

                                        {/* Risk Breakdown */}
                                        <div className="flex-1 grid grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Diabetes</p>
                                                <p className="font-bold">{prediction.risks.diabetes}%</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Heart Disease</p>
                                                <p className="font-bold">{prediction.risks.heart_disease}%</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Obesity</p>
                                                <p className="font-bold">{prediction.risks.obesity}%</p>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <Button variant="outline" size="sm" asChild>
                                            <Link to="/results" state={{ prediction }}>
                                                View Details
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PredictionHistory;
