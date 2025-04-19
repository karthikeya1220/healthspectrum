import React from "react";
import Layout from "@/components/Layout";
import HealthMetricCard from "@/components/HealthMetricCard";
import AppointmentCard, { AppointmentProps } from "@/components/AppointmentCard";
import MedicationCard, { MedicationProps } from "@/components/MedicationCard";
import { Heart, Activity, Weight, Footprints, Plus, ArrowUpRight, AlertTriangle, Pill } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Mock data for health metrics
  const healthMetrics = [
    {
      title: "Heart Rate",
      value: 72,
      unit: "bpm",
      icon: <Heart className="h-5 w-5 text-health-red" />,
      color: "red" as const,
      trend: { value: 2, isPositive: false }
    },
    {
      title: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      icon: <Activity className="h-5 w-5 text-health-blue" />,
      color: "blue" as const,
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Weight",
      value: 68.5,
      unit: "kg",
      icon: <Weight className="h-5 w-5 text-health-purple" />,
      color: "purple" as const,
      trend: { value: 1.2, isPositive: true }
    },
    {
      title: "Steps",
      value: 8243,
      unit: "steps",
      icon: <Footprints className="h-5 w-5 text-health-teal" />,
      color: "teal" as const,
      trend: { value: 12, isPositive: true }
    }
  ];

  // Mock data for upcoming appointments
  const upcomingAppointments: AppointmentProps[] = [
    {
      id: "apt-001",
      title: "Annual Physical Checkup",
      doctorName: "Dr. Sarah Johnson",
      location: "HealthSpectrum Medical Center",
      dateTime: "Mon, May 15 • 10:00 AM",
      status: "upcoming",
      timeUntil: "in 3 days"
    },
    {
      id: "apt-002",
      title: "Dental Cleaning",
      doctorName: "Dr. Michael Chen",
      location: "Bright Smile Dental Clinic",
      dateTime: "Thu, May 25 • 2:30 PM",
      status: "upcoming",
      timeUntil: "in 2 weeks"
    }
  ];

  // Mock data for medications
  const medications: MedicationProps[] = [
    {
      id: "med-001",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      timeOfDay: ["Morning"],
      refillDate: "June 15, 2023",
      instructions: "Take with food",
      isLowSupply: true
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
    }
  ];

  return (
    <Layout 
      title="Dashboard" 
      subtitle="Welcome back, Alex! Here's an overview of your health"
    >
      <div className="space-y-8 animate-fade-in">
        {/* Critical Health Alerts - Most important information first */}
        {medications.some(med => med.isLowSupply) && (
          <section>
            <div className="bg-health-red-light border border-health-red/30 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-medium flex items-center gap-2 text-health-red mb-2">
                <AlertTriangle className="h-5 w-5" />
                Action Required
              </h2>
              <div className="space-y-2">
                {medications.filter(med => med.isLowSupply).map(med => (
                  <div key={med.id} className="flex justify-between items-center bg-white rounded-md p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-health-red/10">
                        <Pill className="h-4 w-4 text-health-red" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{med.name} is low on supply</p>
                        <p className="text-xs text-muted-foreground">Refill date: {med.refillDate}</p>
                      </div>
                    </div>
                    <Link 
                      to={`/medications?action=refill&id=${med.id}`}
                      className="text-xs px-3 py-1.5 rounded-md bg-health-red text-white hover:bg-health-red/90"
                    >
                      Request Refill
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Health Metrics */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Health Metrics</h2>
            <button className="text-sm text-primary flex items-center gap-1 hover:underline">
              View All <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthMetrics.map((metric, index) => (
              <HealthMetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                unit={metric.unit}
                icon={metric.icon}
                color={metric.color}
                trend={metric.trend}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        </section>
        
        {/* Upcoming Appointments */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Upcoming Appointments</h2>
            <Link 
              to="/appointments" 
              className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg btn-primary-action"
            >
              <Plus className="h-4 w-4" />
              Book Appointment
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingAppointments.map((appointment, index) => (
              <AppointmentCard
                key={appointment.id}
                {...appointment}
              />
            ))}
            
            {upcomingAppointments.length === 0 && (
              <div className="col-span-full text-center py-12 bg-secondary/50 rounded-xl">
                <p className="text-muted-foreground">No upcoming appointments</p>
                <Link to="/appointments" className="mt-2 text-primary hover:underline inline-block">
                  Book an appointment
                </Link>
              </div>
            )}
          </div>
        </section>
        
        {/* Medications */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Medications</h2>
            <Link 
              to="/medications" 
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              View All <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.map((medication) => (
              <MedicationCard
                key={medication.id}
                {...medication}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
