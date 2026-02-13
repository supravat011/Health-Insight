import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

const steps = [
  { id: 1, title: "Personal Info" },
  { id: 2, title: "Physical Data" },
  { id: 3, title: "Health Metrics" },
  { id: 4, title: "Lifestyle" },
];

const HealthCheck = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    bloodSugar: "",
    smoking: false,
    alcohol: false,
    exercise: false,
    familyHistory: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const nextStep = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit to backend
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Create health record
      const healthRecordResponse = await apiClient.createHealthRecord({
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        blood_pressure_systolic: parseInt(formData.bloodPressureSystolic),
        blood_pressure_diastolic: parseInt(formData.bloodPressureDiastolic),
        blood_sugar: parseFloat(formData.bloodSugar),
        lifestyle_habits: JSON.stringify({
          smoking: formData.smoking,
          alcohol: formData.alcohol,
          exercise: formData.exercise,
          familyHistory: formData.familyHistory,
        }),
      });

      if (healthRecordResponse.error) {
        toast({
          title: "Error",
          description: healthRecordResponse.message || "Failed to save health data",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const healthRecordId = healthRecordResponse.data.health_record.id;

      // Generate prediction
      const predictionResponse = await apiClient.createPrediction(healthRecordId);

      if (predictionResponse.error) {
        toast({
          title: "Error",
          description: predictionResponse.message || "Failed to generate prediction",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Navigate to results with prediction data
      navigate("/results", {
        state: {
          prediction: predictionResponse.data.prediction,
          explanation: predictionResponse.data.explanation,
          formData
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress Stepper */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${currentStep > step.id
                        ? "bg-primary border-primary"
                        : currentStep === step.id
                          ? "border-primary text-primary"
                          : "border-muted-foreground/30 text-muted-foreground"
                        }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5 text-primary-foreground" />
                      ) : (
                        <span className="font-medium">{step.id}</span>
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium hidden sm:block ${currentStep >= step.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                        }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-8 sm:w-16 md:w-24 mx-2 ${currentStep > step.id ? "bg-primary" : "bg-muted"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl bg-card border border-border p-8 shadow-lg">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">
                    Personal Information
                  </h2>
                  <p className="text-muted-foreground">
                    Let's start with some basic information about you
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={(e) => updateField("age", e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => updateField("gender", value)}
                      className="mt-2 flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="font-normal cursor-pointer">
                          Male
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="font-normal cursor-pointer">
                          Female
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="font-normal cursor-pointer">
                          Other
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Physical Data */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">
                    Physical Measurements
                  </h2>
                  <p className="text-muted-foreground">
                    Help us understand your physical profile
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="e.g., 170"
                      value={formData.height}
                      onChange={(e) => updateField("height", e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="e.g., 70"
                      value={formData.weight}
                      onChange={(e) => updateField("weight", e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Health Metrics */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">
                    Health Metrics
                  </h2>
                  <p className="text-muted-foreground">
                    Enter your latest health readings if available
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Blood Pressure (mmHg)</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Input
                          type="number"
                          placeholder="Systolic (e.g., 120)"
                          value={formData.bloodPressureSystolic}
                          onChange={(e) =>
                            updateField("bloodPressureSystolic", e.target.value)
                          }
                        />
                        <span className="text-xs text-muted-foreground mt-1">
                          Upper number
                        </span>
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Diastolic (e.g., 80)"
                          value={formData.bloodPressureDiastolic}
                          onChange={(e) =>
                            updateField("bloodPressureDiastolic", e.target.value)
                          }
                        />
                        <span className="text-xs text-muted-foreground mt-1">
                          Lower number
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bloodSugar">Fasting Blood Sugar (mg/dL)</Label>
                    <Input
                      id="bloodSugar"
                      type="number"
                      placeholder="e.g., 100"
                      value={formData.bloodSugar}
                      onChange={(e) => updateField("bloodSugar", e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Lifestyle */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">
                    Lifestyle Factors
                  </h2>
                  <p className="text-muted-foreground">
                    Tell us about your lifestyle habits
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div>
                      <Label className="text-base">Do you smoke?</Label>
                      <p className="text-sm text-muted-foreground">
                        Currently or in the past year
                      </p>
                    </div>
                    <Switch
                      checked={formData.smoking}
                      onCheckedChange={(checked) => updateField("smoking", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div>
                      <Label className="text-base">Alcohol consumption?</Label>
                      <p className="text-sm text-muted-foreground">
                        Regular alcohol consumption
                      </p>
                    </div>
                    <Switch
                      checked={formData.alcohol}
                      onCheckedChange={(checked) => updateField("alcohol", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div>
                      <Label className="text-base">Regular exercise?</Label>
                      <p className="text-sm text-muted-foreground">
                        At least 3 times per week
                      </p>
                    </div>
                    <Switch
                      checked={formData.exercise}
                      onCheckedChange={(checked) => updateField("exercise", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div>
                      <Label className="text-base">Family history of diseases?</Label>
                      <p className="text-sm text-muted-foreground">
                        Diabetes, heart disease, etc.
                      </p>
                    </div>
                    <Switch
                      checked={formData.familyHistory}
                      onCheckedChange={(checked) =>
                        updateField("familyHistory", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button variant="hero" onClick={nextStep} disabled={isSubmitting}>
                {currentStep === steps.length ? (
                  <>
                    {isSubmitting ? "Analyzing..." : "Predict Health Risk"}
                    {!isSubmitting && <Check className="h-4 w-4" />}
                  </>
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HealthCheck;
