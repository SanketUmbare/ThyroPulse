
import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FilePlus, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: number;
  personalInfo: {
    firstName: string;
    lastName: string;
    age: string;
    gender: string;
  };
  medicalHistory: {
    familyHistoryThyroid: string;
    radiationExposure: string;
    previousThyroidIssues: string;
    smoking: string;
  };
  symptoms: {
    neckSwelling: string;
    difficultySwallowing: string;
    voiceChanges: string;
    neckPain: string;
    swollenLymphNodes: string;
  };
  labResults: {
    tsh: string;
    t3: string;
    t4: string;
    thyroglobulin: string;
    calcitonin: string;
  };
  timestamp: string;
  predictionResult: string;
  predictionScore: string;
}

const Results = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching patient data
    const fetchPatient = () => {
      setLoading(true);
      try {
        const patients = JSON.parse(localStorage.getItem("patients") || "[]");
        const foundPatient = patients.find((p: Patient) => p.id.toString() === id);
        
        if (foundPatient) {
          setPatient(foundPatient);
        } else {
          toast({
            title: "Patient not found",
            description: "The requested patient data could not be found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        toast({
          title: "Error loading patient data",
          description: "There was an error loading the patient data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id, toast]);

  const riskFactors = useMemo(() => {
    if (!patient) return [];
    
    const factors = [];
    
    if (patient.medicalHistory.familyHistoryThyroid === "yes") {
      factors.push("Family history of thyroid disease");
    }
    
    if (patient.medicalHistory.radiationExposure === "yes") {
      factors.push("Prior radiation exposure to neck/head");
    }
    
    if (patient.medicalHistory.previousThyroidIssues === "yes") {
      factors.push("Previous thyroid issues");
    }
    
    if (patient.medicalHistory.smoking === "current") {
      factors.push("Current smoker");
    }
    
    if (patient.symptoms.neckSwelling === "yes") {
      factors.push("Neck swelling or lump");
    }
    
    if (patient.symptoms.difficultySwallowing === "yes") {
      factors.push("Difficulty swallowing");
    }
    
    if (patient.symptoms.voiceChanges === "yes") {
      factors.push("Voice changes or hoarseness");
    }
    
    if (patient.symptoms.neckPain === "yes") {
      factors.push("Neck pain");
    }
    
    if (patient.symptoms.swollenLymphNodes === "yes") {
      factors.push("Swollen lymph nodes");
    }
    
    return factors;
  }, [patient]);

  const pieChartData = useMemo(() => {
    if (!patient) return [];
    
    const score = parseFloat(patient.predictionScore);
    
    return [
      { name: "Risk", value: score },
      { name: "Safe", value: 100 - score },
    ];
  }, [patient]);

  const COLORS = ["#3D9FFF", "#E0EFFF"];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-pulse-subtle inline-block mb-4">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          </div>
          <p className="text-muted-foreground">Loading patient results...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
          <AlertTriangle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Patient Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The patient record you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/patient-form">
            <FilePlus className="mr-2 h-4 w-4" /> Enter New Patient
          </Link>
        </Button>
      </div>
    );
  }

  const riskLevel = parseFloat(patient.predictionScore) > 60 ? "High" : parseFloat(patient.predictionScore) > 30 ? "Moderate" : "Low";
  const riskColor = riskLevel === "High" ? "text-destructive" : riskLevel === "Moderate" ? "text-orange-500" : "text-green-500";
  
  const formattedDate = new Date(patient.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link to="/patient-history" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Patient History
          </Link>
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patient Info Card */}
          <Card className="border-border/50 shadow-sm md:col-span-3">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                {patient.personalInfo.firstName} {patient.personalInfo.lastName}
                <span className="ml-4 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  {patient.personalInfo.gender === "male" ? "Male" : "Female"}, {patient.personalInfo.age} years
                </span>
              </CardTitle>
              <CardDescription>
                Assessed on {formattedDate}
              </CardDescription>
            </CardHeader>
          </Card>
          
          {/* Risk Assessment Card */}
          <Card className="border-border/50 shadow-sm md:col-span-2">
            <CardHeader>
              <CardTitle>Thyroid Cancer Risk Assessment</CardTitle>
              <CardDescription>
                Analysis based on patient medical history, symptoms, and lab results
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="mb-6 flex items-center">
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold">Risk Level:</h3>
                    <span className={`ml-2 text-lg font-bold ${riskColor}`}>{riskLevel}</span>
                  </div>
                  <Progress value={parseFloat(patient.predictionScore)} className="h-3" />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Low Risk</span>
                    <span className="text-xs text-muted-foreground">High Risk</span>
                  </div>
                </div>
                <div className="ml-4 w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Recommendation:</h3>
                <p className="text-muted-foreground">
                  {riskLevel === "High" ? (
                    "Immediate further evaluation is recommended, including ultrasound and possible biopsy."
                  ) : riskLevel === "Moderate" ? (
                    "Further evaluation is suggested, consider scheduling an ultrasound."
                  ) : (
                    "Regular monitoring advised. Schedule a follow-up in 6-12 months."
                  )}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Risk Factors Identified:</h3>
                {riskFactors.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {riskFactors.map((factor, index) => (
                      <li key={index} className="text-muted-foreground">{factor}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No significant risk factors identified.</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" asChild>
                <Link to="/patient-form">
                  <FilePlus className="mr-2 h-4 w-4" /> New Assessment
                </Link>
              </Button>
              <Button asChild>
                <Link to="/patient-history">
                  View All Patients <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Patient Data Summary Card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Patient Data Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Medical History</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Family History:</span>
                    <span>{patient.medicalHistory.familyHistoryThyroid === "yes" ? "Yes" : "No"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Radiation Exposure:</span>
                    <span>{patient.medicalHistory.radiationExposure === "yes" ? "Yes" : "No"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Previous Thyroid Issues:</span>
                    <span>{patient.medicalHistory.previousThyroidIssues === "yes" ? "Yes" : "No"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Smoking Status:</span>
                    <span>
                      {patient.medicalHistory.smoking === "never" ? "Never Smoked" : 
                       patient.medicalHistory.smoking === "former" ? "Former Smoker" : "Current Smoker"}
                    </span>
                  </li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Symptoms</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Neck Swelling:</span>
                    <span>{patient.symptoms.neckSwelling === "yes" ? "Yes" : "No"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty Swallowing:</span>
                    <span>{patient.symptoms.difficultySwallowing === "yes" ? "Yes" : "No"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Voice Changes:</span>
                    <span>{patient.symptoms.voiceChanges === "yes" ? "Yes" : "No"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Neck Pain:</span>
                    <span>{patient.symptoms.neckPain === "yes" ? "Yes" : "No"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Swollen Lymph Nodes:</span>
                    <span>{patient.symptoms.swollenLymphNodes === "yes" ? "Yes" : "No"}</span>
                  </li>
                </ul>
              </div>
              
              {(patient.labResults.tsh || patient.labResults.t3 || patient.labResults.t4 || 
                patient.labResults.thyroglobulin || patient.labResults.calcitonin) && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Lab Results</h3>
                    <ul className="space-y-2 text-sm">
                      {patient.labResults.tsh && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">TSH:</span>
                          <span>{patient.labResults.tsh} mIU/L</span>
                        </li>
                      )}
                      {patient.labResults.t3 && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">T3:</span>
                          <span>{patient.labResults.t3} ng/dL</span>
                        </li>
                      )}
                      {patient.labResults.t4 && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">T4:</span>
                          <span>{patient.labResults.t4} μg/dL</span>
                        </li>
                      )}
                      {patient.labResults.thyroglobulin && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Thyroglobulin:</span>
                          <span>{patient.labResults.thyroglobulin} ng/mL</span>
                        </li>
                      )}
                      {patient.labResults.calcitonin && (
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Calcitonin:</span>
                          <span>{patient.labResults.calcitonin} pg/mL</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Results;
