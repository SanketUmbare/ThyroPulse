
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FilePlus, ArrowUpDown, Trash2, ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Patient {
  id: number;
  personalInfo: {
    firstName: string;
    lastName: string;
    age: string;
    gender: string;
  };
  timestamp: string;
  predictionResult: string;
  predictionScore: string;
}

const PatientHistory = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    // Load patients from localStorage
    try {
      const storedPatients = JSON.parse(localStorage.getItem("patients") || "[]");
      setPatients(storedPatients);
      setFilteredPatients(storedPatients);
    } catch (error) {
      console.error("Error loading patients:", error);
      toast.error("Failed to load patient records");
    }
  }, []);

  useEffect(() => {
    // Filter patients based on search query
    const filtered = patients.filter((patient) => {
      const fullName = `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });

    // Sort patients
    const sorted = [...filtered].sort((a, b) => {
      let valA, valB;

      if (sortField === "name") {
        valA = `${a.personalInfo.firstName} ${a.personalInfo.lastName}`.toLowerCase();
        valB = `${b.personalInfo.firstName} ${b.personalInfo.lastName}`.toLowerCase();
      } else if (sortField === "age") {
        valA = parseInt(a.personalInfo.age);
        valB = parseInt(b.personalInfo.age);
      } else if (sortField === "timestamp") {
        valA = new Date(a.timestamp).getTime();
        valB = new Date(b.timestamp).getTime();
      } else if (sortField === "risk") {
        valA = parseFloat(a.predictionScore);
        valB = parseFloat(b.predictionScore);
      } else {
        return 0;
      }

      if (sortDirection === "asc") {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    setFilteredPatients(sorted);
  }, [patients, searchQuery, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeletePatient = (id: number) => {
    try {
      const updatedPatients = patients.filter((patient) => patient.id !== id);
      localStorage.setItem("patients", JSON.stringify(updatedPatients));
      setPatients(updatedPatients);
      toast.success("Patient record deleted successfully");
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error("Failed to delete patient record");
    }
  };

  const handleDeleteAllPatients = () => {
    try {
      localStorage.setItem("patients", JSON.stringify([]));
      setPatients([]);
      toast.success("All patient records deleted successfully");
    } catch (error) {
      console.error("Error deleting all patients:", error);
      toast.error("Failed to delete all patient records");
    }
  };

  const getRiskBadge = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore > 60) {
      return <Badge variant="destructive">High Risk</Badge>;
    } else if (numScore > 30) {
      return <Badge className="bg-orange-500 hover:bg-orange-600">Moderate Risk</Badge>;
    } else {
      return <Badge className="bg-green-500 hover:bg-green-600">Low Risk</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Patient History</CardTitle>
                <CardDescription>
                  View and manage all patient records and prediction results
                </CardDescription>
              </div>
              <Button asChild>
                <Link to="/patient-form">
                  <FilePlus className="mr-2 h-4 w-4" /> New Patient
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {patients.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Clear All Records
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all patient records from your local storage.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAllPatients}>
                        Delete All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            
            {filteredPatients.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button
                          variant="ghost"
                          className="p-0 h-auto font-medium"
                          onClick={() => handleSort("name")}
                        >
                          Patient Name
                          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="p-0 h-auto font-medium"
                          onClick={() => handleSort("age")}
                        >
                          Age
                          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="p-0 h-auto font-medium"
                          onClick={() => handleSort("timestamp")}
                        >
                          Date
                          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="p-0 h-auto font-medium"
                          onClick={() => handleSort("risk")}
                        >
                          Risk Level
                          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">
                          {patient.personalInfo.firstName} {patient.personalInfo.lastName}
                        </TableCell>
                        <TableCell>{patient.personalInfo.age}</TableCell>
                        <TableCell>
                          {patient.personalInfo.gender === "male" ? "Male" : "Female"}
                        </TableCell>
                        <TableCell>{formatDate(patient.timestamp)}</TableCell>
                        <TableCell>{getRiskBadge(patient.predictionScore)}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the record for {patient.personalInfo.firstName} {patient.personalInfo.lastName}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeletePatient(patient.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link to={`/results/${patient.id}`}>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No patient records found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? "No patients match your search criteria." : "Start by adding a new patient record."}
                </p>
                <Button asChild>
                  <Link to="/patient-form">
                    <FilePlus className="mr-2 h-4 w-4" /> Add Patient Record
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
          {filteredPatients.length > 0 && (
            <CardFooter className="border-t px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPatients.length} of {patients.length} patient records
              </p>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default PatientHistory;
