
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Calendar, Clock, User, MapPin, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock doctors data
const doctors = [
  { id: "dr-1", name: "Dr. Sarah Johnson", specialty: "General Physician", image: "/placeholder.svg", availability: "Mon, Wed, Fri" },
  { id: "dr-2", name: "Dr. Michael Chen", specialty: "Dentist", image: "/placeholder.svg", availability: "Tue, Thu, Sat" },
  { id: "dr-3", name: "Dr. Emily Wilson", specialty: "Cardiologist", image: "/placeholder.svg", availability: "Mon, Tue, Wed" },
  { id: "dr-4", name: "Dr. James Rodriguez", specialty: "Dermatologist", image: "/placeholder.svg", availability: "Wed, Thu, Fri" },
];

// Mock available time slots
const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", 
  "11:30 AM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
];

const AppointmentBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointmentReason, setAppointmentReason] = useState("");
  const [step, setStep] = useState(1);
  
  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  const handleContinue = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Handle appointment submission
      console.log("Appointment booked!", {
        doctor: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        reason: appointmentReason
      });
      
      // Show success message
      alert("Your appointment has been successfully booked!");
      
      // Reset form
      setSelectedDate(null);
      setSelectedDoctor(null);
      setSelectedTime(null);
      setAppointmentReason("");
      setStep(1);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  return (
    <Layout 
      title="Book an Appointment" 
      subtitle="Schedule your next healthcare visit"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm">
        {/* Progress Steps */}
        <div className="flex justify-between px-6 pt-6">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="flex flex-col items-center"
            >
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm mb-2",
                  step === i 
                    ? "bg-health-blue text-white" 
                    : step > i 
                      ? "bg-health-green text-white" 
                      : "bg-gray-100 text-gray-400"
                )}
              >
                {step > i ? "✓" : i}
              </div>
              <span className={cn(
                "text-xs",
                step >= i ? "text-gray-700" : "text-gray-400"
              )}>
                {i === 1 ? "Doctor" : i === 2 ? "Date" : i === 3 ? "Time" : "Confirm"}
              </span>
            </div>
          ))}
        </div>
        
        <div className="p-6">
          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-medium mb-4">Select a Doctor</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {doctors.map((doctor) => (
                  <div 
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor.id)}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-all",
                      selectedDoctor === doctor.id 
                        ? "border-health-blue bg-health-blue/5" 
                        : "border-gray-200 hover:border-health-blue/30"
                    )}
                  >
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                        <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium">{doctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Available: {doctor.availability}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Step 2: Select Date */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-medium mb-4">Select a Date</h2>
              <div className="border rounded-lg p-4">
                {/* Simple date picker UI - in a real app, use a proper date picker component */}
                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                  
                  {/* Generate fake calendar days */}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 2; // Offset to start from previous month
                    const today = new Date();
                    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + day);
                    const isCurrentMonth = date.getMonth() === today.getMonth();
                    const isPast = date < new Date(today.setHours(0, 0, 0, 0));
                    
                    return (
                      <div 
                        key={i}
                        onClick={() => !isPast && isCurrentMonth && setSelectedDate(date)}
                        className={cn(
                          "h-10 flex items-center justify-center rounded-md text-sm",
                          !isPast && isCurrentMonth ? "cursor-pointer" : "cursor-default",
                          selectedDate && date.toDateString() === selectedDate.toDateString()
                            ? "bg-health-blue text-white" 
                            : isPast 
                              ? "text-gray-300" 
                              : !isCurrentMonth 
                                ? "text-gray-300" 
                                : "hover:bg-gray-100"
                        )}
                      >
                        {date.getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {selectedDate && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Selected Date: {formatDate(selectedDate)}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Step 3: Select Time */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-medium mb-4">Select a Time Slot</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "p-2 text-center rounded-md border text-sm cursor-pointer transition-all",
                      selectedTime === time 
                        ? "bg-health-blue text-white border-health-blue" 
                        : "hover:border-health-blue/30"
                    )}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Step 4: Confirm Details */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-medium mb-4">Confirm Appointment Details</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-3">Appointment Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-health-blue mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          {doctors.find(d => d.id === selectedDoctor)?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doctors.find(d => d.id === selectedDoctor)?.specialty}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-health-blue" />
                      <p className="text-sm">{formatDate(selectedDate)}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-health-blue" />
                      <p className="text-sm">{selectedTime}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-health-blue" />
                      <p className="text-sm">HealthSpectrum Medical Center</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reason for Visit
                  </label>
                  <textarea
                    value={appointmentReason}
                    onChange={(e) => setAppointmentReason(e.target.value)}
                    className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-health-blue"
                    rows={3}
                    placeholder="Please briefly describe the reason for your appointment..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="p-6 border-t flex justify-between">
          <button
            onClick={handleBack}
            className={cn(
              "px-4 py-2 rounded-lg border text-sm",
              step === 1 ? "invisible" : ""
            )}
            disabled={step === 1}
          >
            Back
          </button>
          
          <button
            onClick={handleContinue}
            disabled={
              (step === 1 && !selectedDoctor) ||
              (step === 2 && !selectedDate) ||
              (step === 3 && !selectedTime)
            }
            className={cn(
              "px-4 py-2 rounded-lg text-sm bg-health-blue text-white",
              ((step === 1 && !selectedDoctor) ||
              (step === 2 && !selectedDate) ||
              (step === 3 && !selectedTime))
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-health-blue/90"
            )}
          >
            {step < 4 ? "Continue" : "Book Appointment"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AppointmentBooking;
