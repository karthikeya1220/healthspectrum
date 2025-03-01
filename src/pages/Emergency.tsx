
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { 
  Phone, 
  MapPin, 
  AlertTriangle, 
  Heart, 
  Thermometer, 
  Clipboard, 
  ExternalLink, 
  Share2, 
  MessageSquare, 
  Send,
  Clock,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface EmergencyContactProps {
  name: string;
  relation: string;
  phoneNumber: string;
}

const EmergencyContact = ({ name, relation, phoneNumber }: EmergencyContactProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border flex items-start justify-between">
      <div>
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">{relation}</p>
      </div>
      <a 
        href={`tel:${phoneNumber.replace(/\D/g, '')}`}
        className="bg-health-green text-white p-2 rounded-full hover:bg-health-green/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-health-green"
        aria-label={`Call ${name}`}
      >
        <Phone className="h-4 w-4" />
      </a>
    </div>
  );
};

interface EmergencyFacilityProps {
  name: string;
  address: string;
  distance: string;
  phoneNumber: string;
  isOpen24Hours: boolean;
  waitTime?: string;
}

const EmergencyFacility = ({ 
  name, 
  address, 
  distance, 
  phoneNumber, 
  isOpen24Hours,
  waitTime
}: EmergencyFacilityProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{address}</span>
          </div>
        </div>
        <span className="text-xs bg-secondary px-2 py-1 rounded-full">{distance}</span>
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          {isOpen24Hours && (
            <span className="text-xs bg-health-green/10 text-health-green px-2 py-1 rounded-full flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Open 24 hours
            </span>
          )}
          {waitTime && (
            <span className="text-xs bg-health-blue/10 text-health-blue px-2 py-1 rounded-full flex items-center gap-1">
              <User className="h-3 w-3" />
              {waitTime} wait
            </span>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 mt-3">
        <a 
          href={`tel:${phoneNumber.replace(/\D/g, '')}`}
          className="flex-1 text-center text-sm bg-health-green text-white py-2 rounded-lg hover:bg-health-green/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-health-green"
          aria-label={`Call ${name}`}
        >
          Call
        </a>
        <a 
          href={`https://maps.google.com?q=${encodeURIComponent(name + ' ' + address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-sm bg-health-blue text-white py-2 rounded-lg hover:bg-health-blue/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-health-blue"
          aria-label={`Get directions to ${name}`}
        >
          Directions
        </a>
      </div>
    </div>
  );
};

interface FirstAidCardProps {
  title: string;
  icon: React.ReactNode;
  color: "red" | "blue" | "green" | "orange" | "purple" | "teal";
  onClick: () => void;
}

const FirstAidCard = ({ title, icon, color, onClick }: FirstAidCardProps) => {
  return (
    <button
      className={cn(
        "p-4 rounded-lg flex flex-col items-center text-center transition-all",
        "hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        color === "red" && "bg-health-red-light",
        color === "blue" && "bg-health-blue-light",
        color === "green" && "bg-health-green-light",
        color === "orange" && "bg-health-orange-light",
        color === "purple" && "bg-health-purple-light",
        color === "teal" && "bg-health-teal-light",
      )}
      onClick={onClick}
      aria-label={`First aid guide for ${title}`}
    >
      <div className={cn(
        "p-3 rounded-full mb-2",
        color === "red" && "bg-health-red/20 text-health-red",
        color === "blue" && "bg-health-blue/20 text-health-blue",
        color === "green" && "bg-health-green/20 text-health-green",
        color === "orange" && "bg-health-orange/20 text-health-orange",
        color === "purple" && "bg-health-purple/20 text-health-purple",
        color === "teal" && "bg-health-teal/20 text-health-teal",
      )}>
        {icon}
      </div>
      <span className="font-medium text-sm">{title}</span>
    </button>
  );
};

const Emergency = () => {
  const { toast } = useToast();
  const [showFirstAidDialog, setShowFirstAidDialog] = useState(false);
  const [selectedFirstAid, setSelectedFirstAid] = useState<{ title: string; instructions: string[] }>({
    title: "",
    instructions: []
  });
  
  // Hardcoded emergency contacts
  const emergencyContacts = [
    { name: "John Smith", relation: "Spouse", phoneNumber: "(555) 123-4567" },
    { name: "Sarah Johnson", relation: "Parent", phoneNumber: "(555) 987-6543" },
    { name: "Dr. Michael Chen", relation: "Primary Care Physician", phoneNumber: "(555) 246-8135" }
  ];
  
  // Hardcoded nearby emergency facilities
  const emergencyFacilities = [
    { 
      name: "City General Hospital", 
      address: "123 Medical Center Blvd", 
      distance: "1.2 miles", 
      phoneNumber: "(555) 867-5309", 
      isOpen24Hours: true,
      waitTime: "15 min"
    },
    { 
      name: "Urgent Care Plus", 
      address: "456 Health St", 
      distance: "2.4 miles", 
      phoneNumber: "(555) 555-1234", 
      isOpen24Hours: false,
      waitTime: "5 min"
    },
    { 
      name: "Community Hospital", 
      address: "789 Care Lane", 
      distance: "3.7 miles", 
      phoneNumber: "(555) 321-7654", 
      isOpen24Hours: true,
      waitTime: "30 min"
    }
  ];
  
  // Hardcoded first aid guides
  const firstAidGuides = [
    {
      title: "Heart Attack",
      icon: <Heart className="h-5 w-5" />,
      color: "red" as const,
      instructions: [
        "Call 911 immediately.",
        "Help the person sit down and rest in a position that makes breathing comfortable.",
        "Loosen any tight clothing.",
        "If the person is not allergic to aspirin and has no other contraindications, give them an aspirin to chew.",
        "If the person stops breathing, perform CPR if you're trained to do so.",
        "If an automated external defibrillator (AED) is available and the person is unconscious, use it following the device instructions."
      ]
    },
    {
      title: "Choking",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "orange" as const,
      instructions: [
        "Stand behind the person and slightly to one side.",
        "Support their chest with one hand and lean them forward.",
        "Give up to 5 sharp blows between their shoulder blades with the heel of your hand.",
        "If back blows don't help, give up to 5 abdominal thrusts (Heimlich maneuver).",
        "Continue alternating between 5 back blows and 5 abdominal thrusts until the object is dislodged or emergency help arrives."
      ]
    },
    {
      title: "Bleeding",
      icon: <Thermometer className="h-5 w-5" />,
      color: "blue" as const,
      instructions: [
        "Apply direct pressure to the wound using a clean cloth, tissue, or bandage.",
        "If possible, elevate the wounded area above the heart.",
        "Once the bleeding stops, clean the wound with soap and water.",
        "Apply antibiotic ointment if available.",
        "Cover the wound with a sterile bandage.",
        "Seek medical attention for deep wounds, wounds that won't stop bleeding, or if you suspect an infection."
      ]
    },
    {
      title: "Burns",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "purple" as const,
      instructions: [
        "Cool the burn with cool (not cold) running water for 10 to 15 minutes.",
        "Don't use ice, as it can cause further damage.",
        "Don't apply butter, oil, or ointments to a burn.",
        "Cover the burn with a clean, non-stick bandage.",
        "Take over-the-counter pain relievers if needed.",
        "Seek medical attention for large burns, burns that affect joints or the face, or if blisters develop."
      ]
    },
    {
      title: "Fractures",
      icon: <Clipboard className="h-5 w-5" />,
      color: "green" as const,
      instructions: [
        "Keep the injured area immobile and supported.",
        "Apply ice wrapped in a cloth to reduce swelling and pain.",
        "Don't try to realign the bone or push a bone that's sticking out back in.",
        "If you need to move the person, splint the injured area first.",
        "For an arm fracture, use a sling to immobilize the area.",
        "Seek immediate medical attention."
      ]
    },
    {
      title: "Seizures",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "teal" as const,
      instructions: [
        "Help the person lie down and clear the area of anything that could cause injury.",
        "Place a soft cushion or folded clothing under their head.",
        "Don't restrain the person or put anything in their mouth.",
        "Time the seizure - if it lasts more than 5 minutes, call 911.",
        "After the seizure, roll the person onto their side to help keep their airway clear.",
        "Stay with them until they are fully conscious and aware of their surroundings."
      ]
    }
  ];
  
  const openFirstAidGuide = (guide: {title: string; instructions: string[]}) => {
    setSelectedFirstAid(guide);
    setShowFirstAidDialog(true);
  };
  
  const handleShareLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: "Location Shared",
        description: "Your current location has been shared with emergency contacts.",
        variant: "default"
      });
    } else {
      toast({
        title: "Location Sharing Failed",
        description: "Your device doesn't support location sharing.",
        variant: "destructive"
      });
    }
  };
  
  const handleEmergencyMessage = () => {
    toast({
      title: "Emergency Message Sent",
      description: "Your emergency contacts have been notified.",
      variant: "default"
    });
  };
  
  return (
    <Layout 
      title="Emergency" 
      subtitle="Quick access to emergency services and first aid information"
    >
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Emergency Call Button */}
        <div className="mb-8">
          <a 
            href="tel:911" 
            className="w-full bg-health-red hover:bg-health-red/90 text-white py-4 rounded-xl flex items-center justify-center gap-3 text-lg font-medium transition-colors shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-health-red/50"
            aria-label="Call 911 emergency services"
          >
            <Phone className="h-6 w-6" />
            Call 911 Emergency Services
          </a>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <button 
              onClick={handleShareLocation}
              className="flex-1 bg-health-blue hover:bg-health-blue/90 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-health-blue/50"
              aria-label="Share your location with emergency contacts"
            >
              <Share2 className="h-5 w-5" />
              Share Location
            </button>
            <button 
              onClick={handleEmergencyMessage}
              className="flex-1 bg-health-purple hover:bg-health-purple/90 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-health-purple/50"
              aria-label="Send emergency message to contacts"
            >
              <MessageSquare className="h-5 w-5" />
              Emergency Message
            </button>
          </div>
        </div>
        
        {/* Emergency Contacts */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Emergency Contacts</h2>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <EmergencyContact 
                key={index}
                name={contact.name}
                relation={contact.relation}
                phoneNumber={contact.phoneNumber}
              />
            ))}
          </div>
        </div>
        
        {/* Nearby Emergency Facilities */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Nearby Emergency Facilities</h2>
          <div className="space-y-3">
            {emergencyFacilities.map((facility, index) => (
              <EmergencyFacility 
                key={index}
                name={facility.name}
                address={facility.address}
                distance={facility.distance}
                phoneNumber={facility.phoneNumber}
                isOpen24Hours={facility.isOpen24Hours}
                waitTime={facility.waitTime}
              />
            ))}
          </div>
        </div>
        
        {/* First Aid Guides */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">First Aid Guides</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {firstAidGuides.map((guide, index) => (
              <FirstAidCard 
                key={index}
                title={guide.title}
                icon={guide.icon}
                color={guide.color}
                onClick={() => openFirstAidGuide({title: guide.title, instructions: guide.instructions})}
              />
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-secondary/50 rounded-lg border">
            <a 
              href="https://www.redcross.org/take-a-class/first-aid" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1"
            >
              <span>Take a First Aid certification course</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
        
        {/* Medical ID Summary */}
        <div className="mb-8 bg-health-blue-light p-5 rounded-xl border">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-medium mb-2">Your Medical ID</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Your key medical information is available to emergency responders even when your phone is locked.
              </p>
            </div>
            <div className="p-2 rounded-full bg-health-blue/20 text-health-blue">
              <Clipboard className="h-5 w-5" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Blood Type:</span>
              <p>A+</p>
            </div>
            <div>
              <span className="text-muted-foreground">Allergies:</span>
              <p>Penicillin, Shellfish</p>
            </div>
            <div>
              <span className="text-muted-foreground">Conditions:</span>
              <p>Asthma, Hypertension</p>
            </div>
            <div>
              <span className="text-muted-foreground">Medications:</span>
              <p>Albuterol, Lisinopril</p>
            </div>
          </div>
          
          <button 
            className="mt-4 w-full py-2 bg-health-blue text-white rounded-lg hover:bg-health-blue/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-health-blue/50"
          >
            Update Medical ID
          </button>
        </div>
      </div>
      
      {/* First Aid Instructions Dialog */}
      <Dialog open={showFirstAidDialog} onOpenChange={setShowFirstAidDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedFirstAid.title} First Aid</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <ol className="space-y-2 list-decimal pl-5">
              {selectedFirstAid.instructions.map((instruction, index) => (
                <li key={index} className="text-sm">{instruction}</li>
              ))}
            </ol>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            <p>This information is for guidance only and is not a substitute for professional medical advice. Always seek the advice of a qualified healthcare provider.</p>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Emergency;
