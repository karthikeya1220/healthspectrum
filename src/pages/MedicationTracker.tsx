
import React, { useState } from "react";
import Layout from "@/components/Layout";
import MedicationCard, { MedicationProps } from "@/components/MedicationCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Bell, Check, X, Calendar, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const MedicationTracker = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Mock medications data
  const allMedications: MedicationProps[] = [
    {
      id: "med-001",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      timeOfDay: ["Morning"],
      refillDate: "June 15, 2023",
      instructions: "Take with food"
    },
    {
      id: "med-002",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      timeOfDay: ["Morning", "Evening"],
      refillDate: "May 30, 2023",
      instructions: "Take after meals",
      isLowSupply: true
    },
    {
      id: "med-003",
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      timeOfDay: ["Evening"],
      refillDate: "July 10, 2023",
      instructions: "Take with or without food"
    },
    {
      id: "med-004",
      name: "Levothyroxine",
      dosage: "75mcg",
      frequency: "Once daily",
      timeOfDay: ["Morning"],
      refillDate: "June 5, 2023",
      instructions: "Take on an empty stomach"
    }
  ];
  
  const currentMedications = allMedications.filter(med => !med.id.includes("past"));
  const lowSupplyMedications = allMedications.filter(med => med.isLowSupply);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const closeAddDialog = () => {
    setShowAddDialog(false);
  };
  
  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Medication Added",
      description: "Your new medication has been added to your list",
    });
    closeAddDialog();
  };
  
  const handleTakeMedication = (medicationName: string) => {
    toast({
      title: "Medication Taken",
      description: `You've marked ${medicationName} as taken for today`,
    });
  };
  
  const handleSkipMedication = (medicationName: string) => {
    toast({
      title: "Medication Skipped",
      description: `You've skipped ${medicationName} for today`,
      variant: "destructive"
    });
  };
  
  const handleRequestRefill = (medicationName: string) => {
    toast({
      title: "Refill Requested",
      description: `A refill request for ${medicationName} has been sent to your healthcare provider`,
    });
  };
  
  // Determine which medications to display based on active tab
  const displayedMedications = 
    activeTab === "all" ? allMedications :
    activeTab === "current" ? currentMedications :
    lowSupplyMedications;
    
  return (
    <Layout
      title="Medication Tracker"
      subtitle="Keep track of your medications, dosages, and schedules"
    >
      <div className="max-w-6xl mx-auto animate-fade-in">
        {/* Tabs and Add Medication Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="all">All Medications</TabsTrigger>
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="low" className="relative">
                Low Supply
                {lowSupplyMedications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-health-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {lowSupplyMedications.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
                <Plus className="h-4 w-4" />
                Add Medication
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>
                  Enter the details of your new medication
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAddMedication}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-2">
                    <label htmlFor="name" className="text-sm font-medium col-span-4 sm:col-span-1">
                      Name
                    </label>
                    <input
                      id="name"
                      className="col-span-4 sm:col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Medication name"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-2">
                    <label htmlFor="dosage" className="text-sm font-medium col-span-4 sm:col-span-1">
                      Dosage
                    </label>
                    <input
                      id="dosage"
                      className="col-span-4 sm:col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="e.g. 10mg"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-2">
                    <label htmlFor="frequency" className="text-sm font-medium col-span-4 sm:col-span-1">
                      Frequency
                    </label>
                    <select
                      id="frequency"
                      className="col-span-4 sm:col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select frequency</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="Every other day">Every other day</option>
                      <option value="Weekly">Weekly</option>
                      <option value="As needed">As needed</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-2">
                    <label className="text-sm font-medium col-span-4 sm:col-span-1">
                      Time of Day
                    </label>
                    <div className="col-span-4 sm:col-span-3 flex flex-wrap gap-2">
                      {["Morning", "Afternoon", "Evening", "Bedtime"].map((time) => (
                        <label key={time} className="flex items-center gap-2 border rounded-lg p-2 cursor-pointer hover:bg-secondary/50">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{time}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-2">
                    <label htmlFor="instructions" className="text-sm font-medium col-span-4 sm:col-span-1">
                      Instructions
                    </label>
                    <textarea
                      id="instructions"
                      className="col-span-4 sm:col-span-3 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Special instructions"
                      rows={3}
                    ></textarea>
                  </div>
                </div>
                
                <DialogFooter>
                  <button 
                    type="button" 
                    onClick={closeAddDialog}
                    className="px-4 py-2 rounded-lg border hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                  >
                    Add Medication
                  </button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Today's Schedule */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Today's Schedule</h2>
          
          <div className="bg-white rounded-xl border p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Morning", "Afternoon", "Evening"].map((timeOfDay) => (
                <div key={timeOfDay} className="rounded-lg p-4 bg-secondary/30">
                  <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Bell className="h-4 w-4 text-health-orange" />
                    {timeOfDay}
                  </h3>
                  
                  <div className="space-y-3">
                    {allMedications
                      .filter(med => med.timeOfDay.includes(timeOfDay))
                      .map(med => (
                        <div 
                          key={`${med.id}-${timeOfDay}`} 
                          className="flex items-center justify-between bg-white p-3 rounded-lg border"
                        >
                          <div>
                            <p className="font-medium text-sm">{med.name}</p>
                            <p className="text-xs text-muted-foreground">{med.dosage}</p>
                          </div>
                          
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handleTakeMedication(med.name)}
                              className="p-1.5 rounded-md bg-health-green/10 text-health-green hover:bg-health-green/20"
                              title="Mark as taken"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleSkipMedication(med.name)}
                              className="p-1.5 rounded-md bg-health-red/10 text-health-red hover:bg-health-red/20"
                              title="Skip dose"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    }
                    
                    {allMedications.filter(med => med.timeOfDay.includes(timeOfDay)).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No medications scheduled
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Medications List */}
        <div>
          <h2 className="text-xl font-medium mb-4">My Medications</h2>
          
          {displayedMedications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedMedications.map((medication) => (
                <div key={medication.id} className="relative">
                  <MedicationCard {...medication} />
                  
                  <div className="absolute top-4 right-4 flex gap-1">
                    {medication.isLowSupply && (
                      <button
                        onClick={() => handleRequestRefill(medication.name)}
                        className="p-1.5 rounded-md bg-health-blue/10 text-health-blue hover:bg-health-blue/20"
                        title="Request refill"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      className="p-1.5 rounded-md bg-secondary hover:bg-secondary/70"
                      title="View schedule"
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary/50 rounded-xl">
              <p className="text-muted-foreground">No medications to display</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MedicationTracker;
