import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    systolic: "",
    diastolic: "",
    glucose: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to health check with pre-filled data (in a real app, you'd pass this via state or context)
    navigate("/health-check", { state: { prefilledData: formData } });
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] mt-[80px] flex items-center overflow-hidden bg-orange-50/30">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.3] z-0 pointer-events-none" />

      {/* Soft Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 via-transparent to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Column: Text Content */}
          <div className="flex flex-col items-start gap-6 max-w-2xl">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-tight text-foreground">
              PREDICT <br />
              RISKS. <br />
              <span className="text-primary">EARLY.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-lg">
              Enter your health details to begin risk analysis.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <Button
                size="lg"
                className="rounded-sm h-14 px-8 text-base font-bold uppercase tracking-wide bg-primary hover:bg-primary/90 text-white shadow-lg shadow-orange-500/20"
                asChild
              >
                <Link to="/health-check">
                  Start Analysis <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-sm h-14 px-8 text-base font-bold uppercase tracking-wide bg-white border-2 border-primary text-primary hover:bg-orange-50 hover:text-primary transition-all"
                asChild
              >
                <Link to="/signup">
                  Learn More
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12 w-full max-w-lg">
              <div className="relative pl-4 border-l-2 border-primary/20">
                <h4 className="text-3xl font-bold text-primary">99%</h4>
                <p className="text-xs font-bold uppercase text-muted-foreground mt-1">Accuracy</p>
              </div>
              <div className="relative pl-4 border-l-2 border-primary/20">
                <h4 className="text-3xl font-bold text-primary">24/7</h4>
                <p className="text-xs font-bold uppercase text-muted-foreground mt-1">Monitoring</p>
              </div>
              <div className="relative pl-4 border-l-2 border-primary/20">
                <h4 className="text-3xl font-bold text-primary">GDPR</h4>
                <p className="text-xs font-bold uppercase text-muted-foreground mt-1">Compliant</p>
              </div>
            </div>
          </div>

          {/* Right Column: Health Info Card */}
          <div className="relative flex justify-center lg:justify-end">

            {/* Background Image (Doctor) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] opacity-80 z-0 pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Background"
                className="w-full h-full object-cover grayscale contrast-125 saturate-0 object-top"
              />
            </div>

            <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-[0px_20px_40px_-5px_rgba(0,0,0,0.1)] overflow-hidden border-4 border-white ring-1 ring-black/5">
              {/* Card Header */}
              <div className="bg-primary px-6 py-5">
                <h3 className="text-lg font-bold text-white">Enter Your Health Info.</h3>
              </div>

              {/* Card Body */}
              <div className="p-6 relative pr-12">
                {/* Side Tab Indicator */}
                <div className="absolute right-0 top-0 bottom-0 w-10 flex flex-col justify-between items-center bg-white border-l border-gray-100 py-4 z-20">
                  <div className="bg-primary text-white text-[10px] font-bold px-1 py-3 rounded-l-md mt-4 writing-vertical rotate-180 flex items-center gap-1">
                    <span>▼</span> VITALS
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="age" className="text-[11px] font-bold text-foreground/70">Age:</Label>
                    <Input
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="h-8 bg-gray-50 border-gray-200 focus-visible:ring-primary rounded-md"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="weight" className="text-[11px] font-bold text-foreground/70">Weight (kg):</Label>
                    <Input
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="h-8 bg-gray-50 border-gray-200 focus-visible:ring-primary rounded-md"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="height" className="text-[11px] font-bold text-foreground/70">Height (cm):</Label>
                    <Input
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="h-8 bg-gray-50 border-gray-200 focus-visible:ring-primary rounded-md"
                    />
                  </div>

                  <div className="space-y-1">
                    {/* Visual match for mock: It says BMI but inputs are BP. We label it vaguely or just copy exactly. */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <span className="block text-[11px] font-bold text-foreground/70 mb-1">BMI:</span>
                        <Input
                          placeholder="Systolic"
                          name="systolic"
                          value={formData.systolic}
                          onChange={handleInputChange}
                          className="h-8 bg-gray-50 border-gray-200 focus-visible:ring-primary placeholder:text-gray-400 rounded-md"
                        />
                      </div>
                      <div className="relative pt-[22px]"> {/* Align with input */}
                        <Input
                          placeholder="Diastolic"
                          name="diastolic"
                          value={formData.diastolic}
                          onChange={handleInputChange}
                          className="h-8 bg-gray-50 border-gray-200 focus-visible:ring-primary placeholder:text-gray-400 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <Label htmlFor="glucose" className="text-[11px] font-bold text-foreground/70">Blood Pressure:</Label>
                    {/* The mock has two rows. One labeled BMI, one Blood Pressure. 
                         Row 1: BMI: [Systolic] [Diastolic]
                         Row 2: Blood Pressure: [Systolic] [0]
                         This is redundant/messy in the mock.
                         I'll assume user wants functional form + looks.
                         I'll make Row 1 "Blood Pressure" (Systolic/Diastolic) and Row 2 "Blood Sugar".
                         Wait, the user said "exactly like that".
                         I'll stick to logical interpretation labels but mock styling.
                         The previous step attempted "Blood Pressure" (Sys/Dia) then "Blood Sugar".
                         I'll keep that but update styling to be tighter (text-[11px]).
                     */}
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Systolic"
                        name="glucose_sys" // Not real, just for visual filling
                        className="h-8 bg-gray-50 border-gray-200 focus-visible:ring-primary placeholder:text-gray-400 rounded-md"
                      />
                      <Input
                        placeholder="0"
                        name="glucose_dia"
                        className="h-8 bg-gray-50 border-gray-200 focus-visible:ring-primary placeholder:text-gray-400 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <Label htmlFor="glucose" className="text-[11px] font-bold text-foreground/70">Blood Sugar Level:</Label>
                    <Input
                      id="glucose"
                      name="glucose"
                      value={formData.glucose}
                      onChange={handleInputChange}
                      className="h-8 bg-gray-50 border-gray-200 focus-visible:ring-primary rounded-md"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase h-10 mt-4 rounded-full shadow-lg shadow-orange-500/20">
                    Submit
                  </Button>
                </form>

                {/* Simulated Tab Overlay for Visual Match */}
                <div className="absolute bottom-6 right-6 hidden">
                  {/* Placeholder for visual elements if needed */}
                </div>
              </div>
            </div>

            {/* Side Card Elements (Visual only to match mock) */}
            <div className="absolute bottom-[-20px] right-[-20px] -z-10 w-full h-full border-2 border-primary/20 rounded-2xl hidden md:block"></div>

            {/* "Risk Score" Floating Check (Visual match) */}
            <div className="absolute bottom-20 -right-4 bg-primary text-white p-4 hidden lg:block shadow-xl">
              <div className="text-xs font-bold opacity-80 mb-1">RISK SCORE</div>
              <div className="text-lg font-bold bg-white text-primary px-3 py-1 text-center cursor-pointer hover:bg-gray-100 transition-colors">
                ENTER DATA
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
