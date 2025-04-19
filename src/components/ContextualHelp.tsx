import React, { useState } from 'react';
import { HelpCircle, Search, X, ExternalLink, ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HelpTopic {
  id: string;
  title: string;
  content: React.ReactNode;
  category: string;
  tags: string[];
  relatedTopics?: string[];
  videoUrl?: string;
  imageUrl?: string;
}

interface ContextualHelpProps {
  contextId?: string;
  buttonSize?: 'sm' | 'default' | 'lg';
  buttonVariant?: 'default' | 'outline' | 'ghost';
  className?: string;
  showTitle?: boolean;
  title?: string;
  children?: React.ReactNode;
  searchPlaceholder?: string;
  showIconButton?: boolean;
}

// Sample help topics data - In a real app this would come from an API or CMS
const helpTopics: HelpTopic[] = [
  {
    id: 'appointments-booking',
    title: 'How to book an appointment',
    content: (
      <div className="space-y-4">
        <p>Follow these simple steps to book an appointment:</p>
        <ol className="list-decimal ml-5 space-y-2">
          <li>Navigate to the Appointments section from the main dashboard</li>
          <li>Click the "Book Appointment" button</li>
          <li>Select your preferred healthcare provider</li>
          <li>Choose an available date and time</li>
          <li>Provide any additional information if requested</li>
          <li>Confirm your appointment</li>
        </ol>
        <p>After booking, you'll receive a confirmation email and notification.</p>
      </div>
    ),
    category: 'Appointments',
    tags: ['booking', 'schedule', 'doctor', 'appointment'],
    relatedTopics: ['appointments-rescheduling', 'appointments-cancellation'],
    imageUrl: '/help/booking-appointment.png'
  },
  {
    id: 'medication-tracker',
    title: 'Using the medication tracker',
    content: (
      <div className="space-y-4">
        <p>The medication tracker helps you manage all your medications:</p>
        <ul className="list-disc ml-5 space-y-2">
          <li>Track medication schedules and dosages</li>
          <li>Receive reminders when it's time to take medication</li>
          <li>Record when you've taken or skipped doses</li>
          <li>Get notifications when refills are needed</li>
        </ul>
        <p>
          <strong>Tip:</strong> Enable notifications to get reminders directly on your device.
        </p>
      </div>
    ),
    category: 'Medications',
    tags: ['medication', 'reminders', 'tracking', 'prescription'],
    videoUrl: '/help/medication-tracker-tutorial.mp4'
  }
];

// This could be expanded with more topics for a real application

export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  contextId,
  buttonSize = 'default',
  buttonVariant = 'ghost',
  className,
  showTitle = false,
  title = "Help",
  children,
  searchPlaceholder = "Search help topics...",
  showIconButton = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null);
  const [savedTopics, setSavedTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem('healthspectrum-saved-help-topics');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Filter topics based on context and search query
  const filteredTopics = React.useMemo(() => {
    return helpTopics.filter(topic => {
      // If contextId is provided, prioritize related topics
      const isContextRelevant = !contextId || 
        topic.id === contextId || 
        topic.relatedTopics?.includes(contextId);
      
      // If search query exists, filter by search
      const matchesSearch = !searchQuery || 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return isContextRelevant && matchesSearch;
    }).sort((a, b) => {
      // Prioritize exact context matches
      if (a.id === contextId && b.id !== contextId) return -1;
      if (a.id !== contextId && b.id === contextId) return 1;
      
      // Then prioritize saved topics
      const aIsSaved = savedTopics.includes(a.id);
      const bIsSaved = savedTopics.includes(b.id);
      if (aIsSaved && !bIsSaved) return -1;
      if (!aIsSaved && bIsSaved) return 1;
      
      // Then sort alphabetically
      return a.title.localeCompare(b.title);
    });
  }, [contextId, searchQuery, savedTopics]);
  
  // Group topics by category
  const groupedTopics = React.useMemo(() => {
    const grouped: Record<string, HelpTopic[]> = {};
    
    filteredTopics.forEach(topic => {
      if (!grouped[topic.category]) {
        grouped[topic.category] = [];
      }
      grouped[topic.category].push(topic);
    });
    
    return grouped;
  }, [filteredTopics]);
  
  const toggleSavedTopic = (topicId: string) => {
    setSavedTopics(prev => {
      const newSaved = prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId];
        
      localStorage.setItem('healthspectrum-saved-help-topics', JSON.stringify(newSaved));
      return newSaved;
    });
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <div className={cn("inline-flex items-center", className)}>
            {showIconButton && (
              <Button variant={buttonVariant} size={buttonSize} className="gap-1.5">
                <HelpCircle className="h-4 w-4" />
                {showTitle && <span>{title}</span>}
              </Button>
            )}
          </div>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{selectedTopic ? selectedTopic.title : 'Help Center'}</DialogTitle>
        </DialogHeader>
        
        {selectedTopic ? (
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="mb-4 flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedTopic(null)}
                className="gap-1"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                <span>Back</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleSavedTopic(selectedTopic.id)}
                className="gap-1"
              >
                {savedTopics.includes(selectedTopic.id) ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 text-primary" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    <span>Save</span>
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-6">
              {selectedTopic.imageUrl && (
                <img 
                  src={selectedTopic.imageUrl} 
                  alt={`Illustration for ${selectedTopic.title}`} 
                  className="rounded-lg border w-full"
                />
              )}
              
              <div className="prose prose-sm max-w-none">
                {selectedTopic.content}
              </div>
              
              {selectedTopic.videoUrl && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Video Tutorial</h3>
                  <video 
                    src={selectedTopic.videoUrl} 
                    controls 
                    className="w-full rounded-lg"
                    poster="/help/video-thumbnail.jpg"
                  ></video>
                </div>
              )}
              
              {selectedTopic.relatedTopics && selectedTopic.relatedTopics.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Related Topics</h3>
                  <div className="space-y-1">
                    {selectedTopic.relatedTopics.map(topicId => {
                      const topic = helpTopics.find(t => t.id === topicId);
                      if (!topic) return null;
                      
                      return (
                        <Button
                          key={topicId}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => setSelectedTopic(topic)}
                        >
                          <ArrowRight className="mr-2 h-4 w-4" />
                          {topic.title}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text"
                placeholder={searchPlaceholder}
                className="w-full rounded-md border border-input pl-9 pr-4 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              {savedTopics.length > 0 && !searchQuery && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <BookmarkCheck className="mr-1.5 h-4 w-4 text-primary" />
                    Saved Topics
                  </h3>
                  <div className="space-y-1">
                    {helpTopics
                      .filter(topic => savedTopics.includes(topic.id))
                      .map(topic => (
                        <Button
                          key={topic.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => setSelectedTopic(topic)}
                        >
                          {topic.title}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
              
              {Object.keys(groupedTopics).length > 0 ? (
                Object.entries(groupedTopics).map(([category, topics]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-sm font-medium mb-2">{category}</h3>
                    <div className="space-y-1">
                      {topics.map(topic => (
                        <Button
                          key={topic.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => setSelectedTopic(topic)}
                        >
                          {topic.title}
                          {savedTopics.includes(topic.id) && (
                            <BookmarkCheck className="ml-auto h-4 w-4 text-primary" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-secondary p-3 mb-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No matching topics found</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    Try searching with different keywords or browse all categories
                  </p>
                </div>
              )}
            </div>
          </>
        )}
        
        <DialogFooter className="border-t pt-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            asChild
          >
            <a href="/help-support" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span>Visit Help Center</span>
            </a>
          </Button>
          <DialogClose asChild>
            <Button size="sm">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
