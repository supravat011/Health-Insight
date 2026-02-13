import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, Heart, Scale, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

const HealthRecords = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [records, setRecords] = useState<any[]>([]);

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        setIsLoading(true);
        const response = await apiClient.getHealthRecords(1, 20);

        if (response.data) {
            setRecords(response.data.health_records || []);
        } else {
            toast({
                title: "Error",
                description: "Failed to load health records",
                variant: "destructive",
            });
        }
        setIsLoading(false);
    };

    const getBMICategory = (bmi: number) => {
        if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600" };
        if (bmi < 25) return { label: "Normal", color: "text-green-600" };
        if (bmi < 30) return { label: "Overweight", color: "text-yellow-600" };
        return { label: "Obese", color: "text-red-600" };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 py-12 flex items-center justify-center">
                    <p className="text-muted-foreground">Loading health records...</p>
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
                        <h1 className="text-3xl font-bold text-foreground mb-2">Health Records</h1>
                        <p className="text-muted-foreground">View all your health data history</p>
                    </div>

                    {records.length === 0 ? (
                        <div className="text-center py-12">
                            <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No health records yet</h2>
                            <p className="text-muted-foreground mb-6">Create your first health record</p>
                            <Button variant="hero" asChild>
                                <Link to="/health-check">Start Health Check</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {records.map((record) => {
                                const bmiCategory = getBMICategory(record.bmi);
                                return (
                                    <div
                                        key={record.id}
                                        className="rounded-2xl bg-card border border-border p-6 card-hover"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(record.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${bmiCategory.color} bg-secondary`}>
                                                BMI: {record.bmi}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Scale className="h-4 w-4 text-primary" />
                                                        <p className="text-xs text-muted-foreground">Weight</p>
                                                    </div>
                                                    <p className="font-semibold">{record.weight} kg</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Activity className="h-4 w-4 text-primary" />
                                                        <p className="text-xs text-muted-foreground">Height</p>
                                                    </div>
                                                    <p className="font-semibold">{record.height} cm</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Heart className="h-4 w-4 text-primary" />
                                                        <p className="text-xs text-muted-foreground">Blood Pressure</p>
                                                    </div>
                                                    <p className="font-semibold">
                                                        {record.blood_pressure?.systolic}/{record.blood_pressure?.diastolic}
                                                    </p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Droplets className="h-4 w-4 text-primary" />
                                                        <p className="text-xs text-muted-foreground">Blood Sugar</p>
                                                    </div>
                                                    <p className="font-semibold">{record.blood_sugar} mg/dL</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HealthRecords;
