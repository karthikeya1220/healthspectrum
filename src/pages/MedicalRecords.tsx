import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Search, 
  Calendar, 
  Download, 
  Upload, 
  Clipboard, 
  Activity, 
  Filter, 
  BarChart3, 
  ChevronRight, 
  ArrowUpDown 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MedicalRecord {
  id: string;
  type: string;
  date: Date;
  provider: string;
  description: string;
  files?: { name: string; size: string }[];
}

interface LabResult {
  id: string;
  name: string;
  date: Date;
  category: string;
  result: string;
  normalRange: string;
  status: "normal" | "abnormal" | "critical";
}

const MedicalRecords = () => {
  const [activeTab, setActiveTab] = useState("records");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Mock data for medical records
  const allRecords: MedicalRecord[] = [
    {
      id: "rec-001",
      type: "Doctor Visit",
      date: new Date(2023, 3, 15),
      provider: "Dr. Sarah Johnson",
      description: "Annual physical examination",
      files: [
        { name: "Physical_Exam_Report.pdf", size: "1.2 MB" },
        { name: "Prescription.pdf", size: "0.5 MB" }
      ]
    },
    {
      id: "rec-002",
      type: "Lab Test",
      date: new Date(2023, 2, 10),
      provider: "HealthSpectrum Laboratory",
      description: "Comprehensive blood panel",
      files: [
        { name: "Blood_Test_Results.pdf", size: "2.3 MB" },
      ]
    },
    {
      id: "rec-003",
      type: "Imaging",
      date: new Date(2023, 1, 5),
      provider: "Advanced Imaging Center",
      description: "Chest X-ray",
      files: [
        { name: "Chest_Xray.dicom", size: "15.7 MB" },
        { name: "Radiologist_Report.pdf", size: "0.8 MB" }
      ]
    },
    {
      id: "rec-004",
      type: "Vaccination",
      date: new Date(2023, 0, 20),
      provider: "Community Health Clinic",
      description: "Influenza vaccine",
      files: [
        { name: "Vaccination_Record.pdf", size: "0.3 MB" },
      ]
    },
    {
      id: "rec-005",
      type: "Surgery",
      date: new Date(2022, 9, 12),
      provider: "Memorial Hospital",
      description: "Appendectomy",
      files: [
        { name: "Surgical_Report.pdf", size: "3.1 MB" },
        { name: "Discharge_Summary.pdf", size: "1.5 MB" },
        { name: "Follow_Up_Instructions.pdf", size: "0.7 MB" }
      ]
    }
  ];
  
  // Mock data for lab results
  const labResults: LabResult[] = [
    {
      id: "lab-001",
      name: "Hemoglobin A1c",
      date: new Date(2023, 3, 15),
      category: "Blood Glucose",
      result: "5.7%",
      normalRange: "Below 5.7%",
      status: "normal"
    },
    {
      id: "lab-002",
      name: "LDL Cholesterol",
      date: new Date(2023, 3, 15),
      category: "Lipid Panel",
      result: "145 mg/dL",
      normalRange: "Below 100 mg/dL",
      status: "abnormal"
    },
    {
      id: "lab-003",
      name: "HDL Cholesterol",
      date: new Date(2023, 3, 15),
      category: "Lipid Panel",
      result: "55 mg/dL",
      normalRange: "Above 40 mg/dL",
      status: "normal"
    },
    {
      id: "lab-004",
      name: "Thyroid Stimulating Hormone (TSH)",
      date: new Date(2023, 2, 10),
      category: "Thyroid Function",
      result: "0.15 mIU/L",
      normalRange: "0.4 - 4.0 mIU/L",
      status: "abnormal"
    },
    {
      id: "lab-005",
      name: "White Blood Cell Count",
      date: new Date(2023, 2, 10),
      category: "Complete Blood Count",
      result: "11.5 K/μL",
      normalRange: "4.5 - 11.0 K/μL",
      status: "abnormal"
    },
    {
      id: "lab-006",
      name: "Blood Pressure",
      date: new Date(2023, 3, 15),
      category: "Vital Signs",
      result: "160/95 mmHg",
      normalRange: "Below 120/80 mmHg",
      status: "critical"
    }
  ];
  
  // Filter records based on activeFilter
  const filteredRecords = activeFilter === "all" 
    ? allRecords 
    : allRecords.filter(record => record.type.toLowerCase() === activeFilter);
  
  // Sort records based on date and sortDirection
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortDirection === "asc") {
      return a.date.getTime() - b.date.getTime();
    } else {
      return b.date.getTime() - a.date.getTime();
    }
  });
  
  const handleToggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };
  
  // Filter lab results based on their status
  const normalResults = labResults.filter(result => result.status === "normal");
  const abnormalResults = labResults.filter(result => result.status === "abnormal" || result.status === "critical");
  
  return (
    <Layout
      title="Medical Records"
      subtitle="Access and manage your health documents and lab results"
    >
      <div className="max-w-6xl mx-auto animate-fade-in">
        <Tabs defaultValue="records" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="records" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Records
              </TabsTrigger>
              <TabsTrigger value="labs" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Lab Results
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Health Trends
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`}
                  className="pl-10 pr-4 py-2 h-10 bg-secondary rounded-lg text-sm w-60 focus-visible:ring-1 focus-visible:ring-primary outline-none"
                />
              </div>
              
              <button className="p-2 rounded-lg border hover:bg-secondary transition-colors">
                <Upload className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <TabsContent value="records" className="mt-0">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter:</span>
                <select 
                  className="text-sm bg-secondary px-3 py-1.5 rounded-lg focus-visible:ring-1 focus-visible:ring-primary outline-none"
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                >
                  <option value="all">All Records</option>
                  <option value="doctor visit">Doctor Visits</option>
                  <option value="lab test">Lab Tests</option>
                  <option value="imaging">Imaging</option>
                  <option value="vaccination">Vaccinations</option>
                  <option value="surgery">Surgeries</option>
                </select>
              </div>
              
              <button 
                onClick={handleToggleSort}
                className="flex items-center gap-1 text-sm hover:bg-secondary p-1.5 rounded-lg transition-colors"
              >
                <Calendar className="h-4 w-4" />
                Date
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {sortedRecords.length > 0 ? (
                sortedRecords.map(record => (
                  <div key={record.id} className="glass-card rounded-xl p-5 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-health-purple-light text-health-purple">
                            {record.type}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {format(record.date, "MMM d, yyyy")}
                          </span>
                        </div>
                        
                        <h3 className="font-medium mt-1">{record.description}</h3>
                        <p className="text-sm text-muted-foreground">{record.provider}</p>
                      </div>
                      
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    
                    {record.files && record.files.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Attached Files</p>
                        <div className="space-y-2">
                          {record.files.map((file, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between bg-secondary/30 p-2 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-muted-foreground">{file.size}</span>
                              </div>
                              
                              <button className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-secondary/50 rounded-xl">
                  <p className="text-muted-foreground">No medical records found</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="labs" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="col-span-1 lg:col-span-2">
                <div className="bg-white rounded-xl border p-5 h-full">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Clipboard className="h-4 w-4 text-health-purple" />
                    Latest Results Summary
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-health-green-light flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-health-green"></div>
                        <span className="text-sm font-medium">Normal</span>
                      </div>
                      <span className="text-sm font-medium">{normalResults.length}</span>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-health-orange-light flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-health-orange"></div>
                        <span className="text-sm font-medium">Abnormal</span>
                      </div>
                      <span className="text-sm font-medium">{abnormalResults.length}</span>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-health-red-light flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-health-red"></div>
                        <span className="text-sm font-medium">Critical</span>
                      </div>
                      <span className="text-sm font-medium">
                        {labResults.filter(r => r.status === "critical").length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Recent Categories</h4>
                    <div className="space-y-2">
                      {Array.from(new Set(labResults.map(r => r.category))).map(category => (
                        <button 
                          key={category}
                          className="w-full text-left p-3 text-sm rounded-lg hover:bg-secondary transition-colors flex justify-between items-center"
                        >
                          {category}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-1 lg:col-span-3">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select className="text-sm bg-secondary px-3 py-1.5 rounded-lg focus-visible:ring-1 focus-visible:ring-primary outline-none">
                      <option value="all">All Results</option>
                      <option value="abnormal">Abnormal Only</option>
                      <option value="critical">Critical Only</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={handleToggleSort}
                    className="flex items-center gap-1 text-sm hover:bg-secondary p-1.5 rounded-lg transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    Date
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {labResults.map(result => (
                    <div
                      key={result.id}
                      className="glass-card rounded-xl p-5 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-health-blue-light text-health-blue">
                              {result.category}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {format(result.date, "MMM d, yyyy")}
                            </span>
                          </div>
                          
                          <h3 className="font-medium mt-1">{result.name}</h3>
                        </div>
                        
                        <div className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          result.status === "normal" 
                            ? "bg-health-green-light text-health-green" 
                            : result.status === "abnormal"
                              ? "bg-health-orange-light text-health-orange"
                              : "bg-health-red-light text-health-red"
                        )}>
                          {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Result</p>
                          <p className="text-sm font-medium">{result.result}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Normal Range</p>
                          <p className="text-sm">{result.normalRange}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="mt-0">
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-medium mb-6">Health Trends Dashboard</h3>
              
              <div className="text-center py-10">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">Health trends visualization coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">Track your health metrics over time</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MedicalRecords;
