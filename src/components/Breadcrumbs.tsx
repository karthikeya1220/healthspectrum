import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  homeIcon?: boolean;
  maxItems?: number; // Maximum number of items to show before truncating
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
  separator = <ChevronRight className="h-4 w-4 text-muted-foreground" />,
  homeIcon = true,
  maxItems = 4
}) => {
  // If we have more items than maxItems, truncate the middle items
  const displayedItems = items.length > maxItems 
    ? [
        items[0], 
        { label: '...', href: undefined, icon: undefined }, 
        ...items.slice(items.length - (maxItems - 2))
      ]
    : items;

  // Add microdata for SEO and accessibility
  const generateStructuredData = () => {
    const itemListElements = items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href
    }));

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": itemListElements
    };
  };

  return (
    <nav 
      className={cn("flex text-sm", className)} 
      aria-label="Breadcrumb"
    >
      <ol 
        className="flex items-center flex-wrap"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {/* Optional home link at the beginning */}
        {homeIcon && (
          <li 
            className="flex items-center" 
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            <Link 
              to="/" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
              itemProp="item"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only" itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
            <span className="mx-2 text-muted-foreground" aria-hidden="true">
              {separator}
            </span>
          </li>
        )}
        
        {/* Breadcrumb items */}
        {displayedItems.map((item, index) => {
          const isLast = index === displayedItems.length - 1;
          const position = homeIcon ? index + 2 : index + 1;
          
          return (
            <li 
              key={index} 
              className={cn(
                "flex items-center",
                // If this is a truncation indicator, make it obvious
                item.label === '...' && "text-muted-foreground px-1"
              )}
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              {/* If it's the truncation indicator, just show it */}
              {item.label === '...' ? (
                <span>{item.label}</span>
              ) : item.href && !isLast ? (
                // For items with links that aren't the last item
                <Link 
                  to={item.href} 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  itemProp="item"
                >
                  {item.icon && item.icon}
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                // For the last item or items without links
                <span 
                  className={cn(
                    "flex items-center gap-1",
                    isLast ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                  aria-current={isLast ? "page" : undefined}
                  itemProp="name"
                >
                  {item.icon && item.icon}
                  {item.label}
                </span>
              )}
              
              <meta itemProp="position" content={position.toString()} />
              
              {!isLast && (
                <span className="mx-2 text-muted-foreground" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      
      {/* Add structured data for SEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
      />
    </nav>
  );
};

export default Breadcrumbs;
