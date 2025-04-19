import React, { useState, useEffect } from 'react';
import { HelpCircle, Search, X, ExternalLink, ArrowRight, Bookmark, BookmarkCheck, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HelpTopic {
  id: string;
  title: string;
  content: React.ReactNode;
  category: string;
  tags: string[];
  relatedTopics?: string[];
  imageUrl?: string;
  videoUrl?: string;
  lastUpdated?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface ContextualHelpProps {
  contextId?: string;
  buttonSize?: 'sm' | 'default' | 'lg';
  buttonVariant?: 'default' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  showTitle?: boolean;
  title?: string;
  children?: React.ReactNode;
  searchPlaceholder?: string;
  showIconButton?: boolean;
  suggestedTopics?: string[];
  onFeedback?: (topicId: string, helpful: boolean) => void;
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
    imageUrl: '/help/booking-appointment.png',
    difficulty: 'beginner'
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
    videoUrl: '/help/medication-tracker-tutorial.mp4',
    lastUpdated: '2023-12-15',
    difficulty: 'intermediate'
  },
  {
    id: 'emergency-services',
    title: 'Using emergency services',
    content: (
      <div className="space-y-4">
        <p>The Emergency section provides immediate access to critical services:</p>
        <ul className="list-disc ml-5 space-y-2">
          <li>Quick dial to emergency services (911)</li>
          <li>Location sharing with emergency contacts</li>
          <li>First aid guides for common emergencies</li>
          <li>Nearby emergency facilities with directions</li>
        </ul>
        <p className="bg-health-red-light text-health-red p-2 rounded-md text-sm">
          <strong>Important:</strong> In case of a life-threatening emergency, always call 911 immediately.
        </p>
      </div>
    ),
    category: 'Emergency',
    tags: ['emergency', 'urgent care', 'first aid', 'safety'],
    lastUpdated: '2023-11-20',
    difficulty: 'beginner'
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
  showIconButton = true,
  suggestedTopics = [],
  onFeedback
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null);
  const [savedTopics, setSavedTopics] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, boolean | null>>({});

  // Load saved topics from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('healthspectrum-saved-help-topics');
    if (saved) {
      try {
        setSavedTopics(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse saved help topics:", error);
      }
    }
  }, []);

  // Auto-select topic based on context if provided
  useEffect(() => {
    if (contextId) {
      const topic = helpTopics.find(t => t.id === contextId);
      if (topic) {
        setSelectedTopic(topic);
      }
    }
  }, [contextId]);

  // Filter topics based on search query
  const filteredTopics = searchQuery.trim() === '' 
    ? helpTopics
    : helpTopics.filter(topic => {
        const searchLower = searchQuery.toLowerCase();
        return (
          topic.title.toLowerCase().includes(searchLower) ||
          topic.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          topic.category.toLowerCase().includes(searchLower)
        );
      });

  // Group topics by category for better organization
  const topicsByCategory = filteredTopics.reduce<Record<string, HelpTopic[]>>((acc, topic) => {
    if (!acc[topic.category]) {
      acc[topic.category] = [];
    }
    acc[topic.category].push(topic);
    return acc;
  }, {});

  // Helper to toggle saved topics
  const toggleSavedTopic = (topicId: string) => {
    setSavedTopics(prev => {
      const newSaved = prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId];
        
      localStorage.setItem('healthspectrum-saved-help-topics', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  // Handle feedback submission
  const handleFeedback = (topicId: string, helpful: boolean) => {
    setHelpfulFeedback(prev => ({
      ...prev,
      [topicId]: helpful
    }));
    
    if (onFeedback) {
      onFeedback(topicId, helpful);
    }
  };

  // Get suggested topics - either from props or based on current topic
  const getSuggestedTopics = () => {
    if (selectedTopic?.relatedTopics) {
      return selectedTopic.relatedTopics
        .map(id => helpTopics.find(t => t.id === id))
        .filter(Boolean) as HelpTopic[];
    } else if (suggestedTopics.length > 0) {
      return suggestedTopics
        .map(id => helpTopics.find(t => t.id === id))
        .filter(Boolean) as HelpTopic[];
    }
    return [];
  };

  // Copy link to help topic
  const shareHelpTopic = (topic: HelpTopic) => {
    const shareUrl = `${window.location.origin}/help?topic=${topic.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard');
      });
    } else {
      prompt('Copy this link to share:', shareUrl);
    }
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
          <div className="flex flex-col md:flex-row gap-6 overflow-hidden flex-1">
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
                
                <div className="flex items-center gap-2">
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
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareHelpTopic(selectedTopic)}
                    className="gap-1"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                {selectedTopic.difficulty && (
                  <div className="mb-4">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      selectedTopic.difficulty === 'beginner' && "bg-health-green-light text-health-green",
                      selectedTopic.difficulty === 'intermediate' && "bg-health-blue-light text-health-blue",
                      selectedTopic.difficulty === 'advanced' && "bg-health-purple-light text-health-purple",
                    )}>
                      {selectedTopic.difficulty.charAt(0).toUpperCase() + selectedTopic.difficulty.slice(1)}
                    </span>
                  </div>
                )}
                
                {selectedTopic.imageUrl && (
                  <img 
                    src={selectedTopic.imageUrl} 
                    alt={`Illustration for ${selectedTopic.title}`}
                    className="rounded-lg border mb-4 w-full"
                  />
                )}
                
                {selectedTopic.videoUrl && (
                  <div className="mb-4">
                    <video 
                      src={selectedTopic.videoUrl} 
                      controls
                      className="rounded-lg w-full"
                    >
                      Your browser doesn't support video playback.
                    </video>
                  </div>
                )}
                
                <div className="prose prose-sm max-w-none">
                  {selectedTopic.content}
                </div>
                
                {/* Feedback section */}
                <div className="border-t pt-4 mt-8">
                  <p className="text-sm text-muted-foreground mb-2">Was this helpful?</p>
                  <div className="flex gap-2">
                    <Button 
                      variant={helpfulFeedback[selectedTopic.id] === true ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleFeedback(selectedTopic.id, true)}
                      className="gap-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Yes
                    </Button>
                    <Button 
                      variant={helpfulFeedback[selectedTopic.id] === false ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleFeedback(selectedTopic.id, false)}
                      className="gap-1"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      No
                    </Button>
                  </div>
                </div>
                
                {selectedTopic.lastUpdated && (
                  <p className="text-xs text-muted-foreground mt-4">
                    Last updated: {selectedTopic.lastUpdated}
                  </p>
                )}
              </div>
            </div>
            
            {/* Related topics sidebar */}
            <div className="w-full md:w-64 flex-shrink-0 rounded-lg border p-4 bg-secondary/20">
              <h3 className="font-medium text-sm mb-3">Related Topics</h3>
              {getSuggestedTopics().length > 0 ? (
                <div className="space-y-1">
                  {getSuggestedTopics().map(topic => (
                    <Button
                      key={topic.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => setSelectedTopic(topic)}
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      {topic.title}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No related topics available.</p>
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
            
            <div className="flex-1 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="mb-4 w-full justify-start">
                  <TabsTrigger value="all">All Topics</TabsTrigger>
                  <TabsTrigger value="saved">Saved</TabsTrigger>
                  {searchQuery && <TabsTrigger value="search">Search Results</TabsTrigger>}
                </TabsList>
                
                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="all" className="mt-0 h-full">
                    {Object.entries(topicsByCategory).map(([category, topics]) => (
                      <div key={category} className="mb-6">
                        <h3 className="text-lg font-medium mb-2">{category}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {topics.map(topic => (
                            <div 
                              key={topic.id}
                              className="p-4 border rounded-lg bg-card hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
                              onClick={() => setSelectedTopic(topic)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{topic.title}</h4>
                                {savedTopics.includes(topic.id) && (
                                  <BookmarkCheck className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {topic.tags.slice(0, 3).map(tag => (
                                  <span 
                                    key={tag} 
                                    className="px-1.5 py-0.5 bg-secondary text-xs rounded-sm"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {topic.tags.length > 3 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{topic.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="saved" className="mt-0 h-full">
                    {savedTopics.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {helpTopics
                          .filter(topic => savedTopics.includes(topic.id))
                          .map(topic => (
                            <div 
                              key={topic.id}
                              className="p-4 border rounded-lg bg-card hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
                              onClick={() => setSelectedTopic(topic)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{topic.title}</h4>
                                <BookmarkCheck className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                              </div>
                              <p className="text-sm text-muted-foreground">{topic.category}</p>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Bookmark className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <h3 className="font-medium mb-1">No saved topics</h3>
                        <p className="text-sm text-muted-foreground">
                          Topics you save will appear here for quick access
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="search" className="mt-0 h-full">
                    {searchQuery && filteredTopics.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filteredTopics.map(topic => (
                          <div 
                            key={topic.id}
                            className="p-4 border rounded-lg bg-card hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
                            onClick={() => setSelectedTopic(topic)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{topic.title}</h4>
                              {savedTopics.includes(topic.id) && (
                                <BookmarkCheck className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{topic.category}</p>
                          </div>
                        ))}
                      </div>
                    ) : searchQuery ? (
                      <div className="text-center py-8">
                        <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <h3 className="font-medium mb-1">No results found</h3>
                        <p className="text-sm text-muted-foreground">
                          Try different keywords or browse all topics
                        </p>
                      </div>
                    ) : null}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
            
            <DialogFooter className="flex justify-between items-center border-t pt-4">
              <a 
                href="https://support.healthspectrum.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Visit support site
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
