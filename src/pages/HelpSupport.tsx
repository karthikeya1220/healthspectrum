
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Mail, 
  Send,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border rounded-lg mb-3 bg-white">
      <button
        className="flex w-full justify-between items-center p-4 text-left font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`faq-${question.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span>{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 flex-shrink-0" />}
      </button>
      
      {isOpen && (
        <div 
          id={`faq-${question.replace(/\s+/g, '-').toLowerCase()}`}
          className="px-4 pb-4 text-sm text-muted-foreground animate-fade-in"
        >
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

interface HelpCategoryProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "teal" | "purple" | "orange" | "blue";
  onClick?: () => void;
}

const HelpCategory = ({ icon, title, description, color, onClick }: HelpCategoryProps) => {
  return (
    <div 
      className={cn(
        "p-5 rounded-xl border cursor-pointer hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        color === "teal" && "card-gradient-teal",
        color === "purple" && "card-gradient-purple",
        color === "orange" && "card-gradient-orange",
        color === "blue" && "card-gradient-blue",
      )}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={title}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      <div className={cn(
        "p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3",
        color === "teal" && "bg-health-teal/20 text-health-teal",
        color === "purple" && "bg-health-purple/20 text-health-purple",
        color === "orange" && "bg-health-orange/20 text-health-orange",
        color === "blue" && "bg-health-blue/20 text-health-blue",
      )}>
        {icon}
      </div>
      
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

const HelpSupport = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  // Hardcoded FAQ data
  const faqItems = [
    {
      question: "How do I schedule an appointment?",
      answer: "To schedule an appointment, navigate to the Appointments section from the main dashboard. Select your preferred doctor, choose an available date and time, and confirm your booking. You'll receive a confirmation notification once the appointment is successfully scheduled."
    },
    {
      question: "How can I track my medications?",
      answer: "To track your medications, go to the Medications section. You can add new medications, set reminders, and track your medication history. The system will send you notifications based on your reminder settings to help you stay on top of your medication schedule."
    },
    {
      question: "How do I access my medical records?",
      answer: "You can access your medical records by navigating to the Medical Records section. There, you'll find all your health documents, test results, and visit summaries. You can view, download, or share these records with your healthcare providers as needed."
    },
    {
      question: "What should I do in case of an emergency?",
      answer: "For medical emergencies, go to the Emergency section for quick access to emergency contacts and services. If it's a life-threatening situation, call emergency services (911) immediately. The Emergency section also provides first-aid guidance and directions to nearby emergency facilities."
    },
    {
      question: "How do I update my personal information?",
      answer: "To update your personal information, go to Settings and select Personal Information. From there, you can edit your contact details, address, and other personal information. Make sure to save your changes after updating."
    }
  ];
  
  // Filtered FAQ items based on search query
  const filteredFaqItems = searchQuery 
    ? faqItems.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;
  
  // Hardcoded help categories
  const helpCategories = [
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Chat Support",
      description: "Connect with our support team via live chat",
      color: "teal" as const,
      onClick: () => {
        toast({
          title: "Live Chat Initialized",
          description: "A support agent will be with you shortly.",
          variant: "default"
        });
      }
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone Support",
      description: "Call our 24/7 helpline for assistance",
      color: "purple" as const,
      onClick: () => {
        window.location.href = "tel:+15551234567";
      }
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "User Guides",
      description: "Step-by-step guides to use the app",
      color: "orange" as const
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Support",
      description: "Send us an email with your query",
      color: "blue" as const,
      onClick: () => {
        window.location.href = "mailto:support@healthspectrum.com";
      }
    }
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!name || !email || !subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill out all the required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Form submission success message
    toast({
      title: "Message Sent",
      description: "We've received your message and will get back to you shortly.",
      variant: "default"
    });
    
    // Reset form
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };
  
  return (
    <Layout 
      title="Help & Support" 
      subtitle="Get assistance and find answers to your questions"
    >
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Search Section */}
        <div className="bg-secondary/50 p-6 rounded-xl border mb-8">
          <h2 className="text-xl font-medium mb-3">How can we help you?</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search for help topics..." 
              className="pl-10 pr-4 py-3 h-12 bg-white border rounded-lg w-full focus-visible:ring-1 focus-visible:ring-primary outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search help topics"
            />
          </div>
        </div>
        
        {/* Help Categories */}
        <h2 className="text-xl font-medium mb-4">Support Options</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {helpCategories.map((category, index) => (
            <HelpCategory 
              key={index}
              icon={category.icon}
              title={category.title}
              description={category.description}
              color={category.color}
              onClick={category.onClick}
            />
          ))}
        </div>
        
        {/* FAQ Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Frequently Asked Questions</h2>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="text-sm text-primary hover:underline flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-2 py-1"
              >
                Clear search <span>&times;</span>
              </button>
            )}
          </div>
          
          {filteredFaqItems.length > 0 ? (
            filteredFaqItems.map((faq, index) => (
              <FaqItem 
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-secondary/30 rounded-lg border text-center">
              <AlertCircle className="h-8 w-8 text-health-red mb-2" />
              <h3 className="font-medium mb-1">No results found</h3>
              <p className="text-sm text-muted-foreground">
                Try different keywords or browse the categories above
              </p>
            </div>
          )}
        </div>
        
        {/* Contact Form */}
        <h2 className="text-xl font-medium mb-4">Send Us a Message</h2>
        <div className="bg-white p-6 rounded-xl border mb-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name <span className="text-health-red">*</span></label>
              <input 
                id="name"
                type="text" 
                className="w-full p-3 border rounded-lg focus-visible:ring-1 focus-visible:ring-primary outline-none"
                placeholder="Enter your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address <span className="text-health-red">*</span></label>
              <input 
                id="email"
                type="email" 
                className="w-full p-3 border rounded-lg focus-visible:ring-1 focus-visible:ring-primary outline-none"
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject <span className="text-health-red">*</span></label>
              <input 
                id="subject"
                type="text" 
                className="w-full p-3 border rounded-lg focus-visible:ring-1 focus-visible:ring-primary outline-none"
                placeholder="What's your question about?" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message <span className="text-health-red">*</span></label>
              <textarea 
                id="message"
                className="w-full p-3 border rounded-lg focus-visible:ring-1 focus-visible:ring-primary outline-none min-h-[120px]"
                placeholder="Please describe your issue or question in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <Send className="h-4 w-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
        
        {/* Contact Information */}
        <div className="bg-secondary/50 p-6 rounded-xl border">
          <h3 className="font-medium mb-3">Contact Information</h3>
          <div className="space-y-3">
            <a href="tel:+15551234567" className="flex items-center gap-3 hover:text-primary transition-colors p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              <Phone className="h-5 w-5 text-health-purple" />
              <span>(555) 123-4567</span>
            </a>
            <a href="mailto:support@healthspectrum.com" className="flex items-center gap-3 hover:text-primary transition-colors p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              <Mail className="h-5 w-5 text-health-blue" />
              <span>support@healthspectrum.com</span>
            </a>
            <div className="flex items-center gap-3 p-1">
              <MessageSquare className="h-5 w-5 text-health-teal" />
              <span>Live chat available 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpSupport;
