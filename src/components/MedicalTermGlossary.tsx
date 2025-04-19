import React, { useState } from "react";
import { HelpCircle, X, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

const medicalTerms: GlossaryTerm[] = [
  {
    term: "Blood Pressure",
    definition: "The pressure of blood pushing against the walls of your arteries. It's typically measured using two numbers: systolic (the higher number) and diastolic (the lower number).",
    category: "Vital Signs",
  },
  {
    term: "BMI (Body Mass Index)",
    definition: "A measure of body fat based on height and weight that applies to adult men and women.",
    category: "Measurements",
  },
  {
    term: "Glucose",
    definition: "A type of sugar that is your body's main source of energy. Blood glucose levels are important to monitor, especially for people with diabetes.",
    category: "Laboratory Values",
  },
  // Add more terms here
];

interface MedicalTermTooltipProps {
  term: string;
  children: React.ReactNode;
}

export const MedicalTermTooltip: React.FC<MedicalTermTooltipProps> = ({ term, children }) => {
  const termData = medicalTerms.find(
    (t) => t.term.toLowerCase() === term.toLowerCase()
  );

  if (!termData) return <>{children}</>;

  return (
    <span className="relative group">
      {children}
      <HelpCircle className="inline ml-0.5 h-3 w-3 text-muted-foreground cursor-help" />
      <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 w-64 p-3 rounded-lg bg-white border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 text-sm">
        <strong>{termData.term}</strong>
        <p className="mt-1 text-muted-foreground">{termData.definition}</p>
      </div>
    </span>
  );
};

export const MedicalTermGlossary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(medicalTerms.map((term) => term.category)));

  const filteredTerms = medicalTerms.filter(
    (term) =>
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || term.category === selectedCategory)
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <HelpCircle className="h-4 w-4" />
          <span>Medical Terms</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Medical Terminology Glossary</DialogTitle>
        </DialogHeader>

        <div className="relative my-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search terms..."
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="text-xs"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="max-h-[300px] overflow-auto pr-1">
          {filteredTerms.length > 0 ? (
            <div className="space-y-3">
              {filteredTerms.map((term) => (
                <div key={term.term} className="border-b pb-2 last:border-0">
                  <h4 className="font-medium text-sm">{term.term}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {term.definition}
                  </p>
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded mt-1 inline-block">
                    {term.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No matching terms found
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
