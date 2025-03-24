import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Save, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { predictThyroidRisk } from "@/utils/thyroidModel";

const formSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    age: z.string().min(1, "Age is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Age must be a positive number",
    }),
    gender: z.enum(["male", "female"]),
  }),
  
  medicalHistory: z.object({
    familyHistoryThyroid: z.enum(["yes", "no"]),
    radiationExposure: z.enum(["yes", "no"]),
    previousThyroidIssues: z.enum(["yes", "no"]),
    smoking: z.string(),
  }),
  
  symptoms: z.object({
    neckSwelling: z.enum(["yes", "no"]),
    difficultySwallowing: z.enum(["yes", "no"]),
    voiceChanges: z.enum(["yes", "no"]),
    neckPain: z.enum(["yes", "no"]),
    swollenLymphNodes: z.enum(["yes", "no"]),
  }),
  
  labResults: z.object({
    tsh: z.string().optional(),
    t3: z.string().optional(),
    t4: z.string().optional(),
    thyroglobulin: z.string().optional(),
    calcitonin: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const PatientForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personalInfo");
  const [labAnalysis, setLabAnalysis] = useState<{
    abnormal: boolean;
    details: string[];
  } | null>(null);
  
  const defaultValues: FormValues = {
    personalInfo: {
      firstName: "",
      lastName: "",
      age: "",
      gender: "male",
    },
    medicalHistory: {
      familyHistoryThyroid: "no",
      radiationExposure: "no",
      previousThyroidIssues: "no",
      smoking: "never",
    },
    symptoms: {
      neckSwelling: "no",
      difficultySwallowing: "no",
      voiceChanges: "no",
      neckPain: "no",
      swollenLymphNodes: "no",
    },
    labResults: {
      tsh: "",
      t3: "",
      t4: "",
      thyroglobulin: "",
      calcitonin: "",
    },
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const onSubmit = (data: FormValues) => {
    const prediction = predictThyroidRisk(data);
    
    const patientId = Math.floor(Math.random() * 10000);
    
    toast.success("Patient data submitted successfully", {
      description: "Redirecting to results page...",
    });
    
    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    const newPatient = {
      id: patientId,
      ...data,
      timestamp: new Date().toISOString(),
      predictionResult: prediction.risk === "high" ? "high_risk" : prediction.risk === "moderate" ? "moderate_risk" : "low_risk",
      predictionScore: prediction.score,
      riskFactors: prediction.factors,
      labAnalysis: prediction.labResultsAnalysis,
    };
    
    patients.push(newPatient);
    localStorage.setItem("patients", JSON.stringify(patients));
    
    setTimeout(() => {
      navigate(`/results/${patientId}`);
    }, 1000);
  };
  
  const nextTab = () => {
    if (activeTab === "personalInfo") setActiveTab("medicalHistory");
    else if (activeTab === "medicalHistory") setActiveTab("symptoms");
    else if (activeTab === "symptoms") setActiveTab("labResults");
  };
  
  const prevTab = () => {
    if (activeTab === "labResults") setActiveTab("symptoms");
    else if (activeTab === "symptoms") setActiveTab("medicalHistory");
    else if (activeTab === "medicalHistory") setActiveTab("personalInfo");
  };

  const analyzeLabResults = () => {
    const labResults = form.getValues("labResults");
    
    const hasValues = Object.values(labResults).some(
      value => value && value.trim() !== ""
    );
    
    if (!hasValues) {
      setLabAnalysis(null);
      toast.info("No lab values entered to analyze");
      return;
    }
    
    const personalInfo = form.getValues("personalInfo");
    const symptoms = form.getValues("symptoms");
    const medicalHistory = form.getValues("medicalHistory");
    
    const prediction = predictThyroidRisk({
      labResults,
      personalInfo,
      symptoms,
      medicalHistory
    });
    
    setLabAnalysis(prediction.labResultsAnalysis);
    
    if (prediction.labResultsAnalysis.abnormal) {
      toast.warning("Abnormal lab results detected", {
        description: "See the analysis below for details",
      });
    } else {
      toast.success("Lab results within normal ranges", {
        description: "No abnormalities detected",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-border/50 shadow-sm card-gradient">
          <CardHeader>
            <CardTitle className="text-2xl">Patient Assessment Form</CardTitle>
            <CardDescription>
              Fill in the patient information to get a thyroid cancer risk prediction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="personalInfo">Personal</TabsTrigger>
                    <TabsTrigger value="medicalHistory">History</TabsTrigger>
                    <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                    <TabsTrigger value="labResults">Lab Results</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personalInfo" className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="personalInfo.firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="personalInfo.lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="personalInfo.age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input placeholder="45" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="personalInfo.gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                              <RadioGroup
                                className="flex space-x-4"
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value="male" />
                                  </FormControl>
                                  <FormLabel className="cursor-pointer">Male</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value="female" />
                                  </FormControl>
                                  <FormLabel className="cursor-pointer">Female</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="medicalHistory" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="medicalHistory.familyHistoryThyroid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Family History of Thyroid Disease</FormLabel>
                          <FormControl>
                            <RadioGroup
                              className="flex space-x-4"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">No</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="medicalHistory.radiationExposure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prior Radiation Exposure to Neck/Head</FormLabel>
                          <FormControl>
                            <RadioGroup
                              className="flex space-x-4"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">No</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="medicalHistory.previousThyroidIssues"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous Thyroid Issues</FormLabel>
                          <FormControl>
                            <RadioGroup
                              className="flex space-x-4"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">No</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="medicalHistory.smoking"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Smoking Status</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select smoking status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="never">Never Smoked</SelectItem>
                              <SelectItem value="former">Former Smoker</SelectItem>
                              <SelectItem value="current">Current Smoker</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="symptoms" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="symptoms.neckSwelling"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Neck Swelling or Lump</FormLabel>
                          <FormControl>
                            <RadioGroup
                              className="flex space-x-4"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">No</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="symptoms.difficultySwallowing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Swallowing</FormLabel>
                          <FormControl>
                            <RadioGroup
                              className="flex space-x-4"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">No</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="symptoms.voiceChanges"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voice Changes or Hoarseness</FormLabel>
                          <FormControl>
                            <RadioGroup
                              className="flex space-x-4"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">No</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="symptoms.neckPain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Neck Pain</FormLabel>
                          <FormControl>
                            <RadioGroup
                              className="flex space-x-4"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">No</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="symptoms.swollenLymphNodes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Swollen Lymph Nodes</FormLabel>
                          <FormControl>
                            <RadioGroup
                              className="flex space-x-4"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="cursor-pointer">No</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="labResults" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Enter any available lab results. These are optional but can help improve prediction accuracy.
                      </p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={analyzeLabResults}
                        size="sm"
                      >
                        Analyze Lab Values
                      </Button>
                    </div>
                    
                    {labAnalysis && labAnalysis.abnormal && (
                      <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Abnormal lab results detected</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            {labAnalysis.details.map((detail, index) => (
                              <li key={index} className="text-sm">{detail}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {labAnalysis && !labAnalysis.abnormal && (
                      <Alert className="bg-primary/10 border-primary/20">
                        <AlertTitle>Lab results within normal ranges</AlertTitle>
                        <AlertDescription>
                          All lab values are within their reference ranges.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="labResults.tsh"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TSH Level (mIU/L)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 2.5" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Normal range: 0.4 - 4.0 mIU/L
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="labResults.t3"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>T3 Level (ng/dL)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 110" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Normal range: 80 - 200 ng/dL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="labResults.t4"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>T4 Level (μg/dL)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 8.5" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Normal range: 5.0 - 12.0 μg/dL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="labResults.thyroglobulin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thyroglobulin (ng/mL)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 15" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Normal range: 3 - 40 ng/mL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="labResults.calcitonin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calcitonin (pg/mL)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 6" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Normal range: &lt;10 pg/mL
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevTab}
                    disabled={activeTab === "personalInfo"}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  
                  {activeTab !== "labResults" ? (
                    <Button type="button" onClick={nextTab}>
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-thyroid-600 hover:bg-thyroid-700">
                      <Save className="mr-2 h-4 w-4" /> Submit for Analysis
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PatientForm;
