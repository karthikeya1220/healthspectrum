import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
}

const routeConfig: Record<string, { label: string; parent?: string }> = {
  '': { label: 'Home' },
  'medications': { label: 'Medications', parent: '' },
  'appointments': { label: 'Appointments', parent: '' },
  'records': { label: 'Medical Records', parent: '' },
  'emergency': { label: 'Emergency', parent: '' },
  'help-support': { label: 'Help & Support', parent: '' },
  'settings': { label: 'Settings', parent: '' },
  'new-medication': { label: 'Add Medication', parent: 'medications' },
  'edit-medication': { label: 'Edit Medication', parent: 'medications' },
  'book-appointment': { label: 'Book Appointment', parent: 'appointments' },
  'reschedule': { label: 'Reschedule', parent: 'appointments' },
};

const Breadcrumbs = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    const buildBreadcrumbs = () => {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      if (pathSegments.length === 0) return [{ path: '/', label: 'Home', icon: <Home className="h-4 w-4" /> }];

      const breadcrumbItems: BreadcrumbItem[] = [{ path: '/', label: 'Home', icon: <Home className="h-4 w-4" /> }];
      let currentPath = '';

      // Recursive function to add parents
      const addParent = (routeKey: string) => {
        const config = routeConfig[routeKey];
        if (config && config.parent) {
          const parentPath = `/${config.parent}`;
          const parentConfig = routeConfig[config.parent];
          if (parentConfig) {
            breadcrumbItems.push({
              path: parentPath,
              label: parentConfig.label,
            });
          }
          addParent(config.parent);
        }
      };

      // Process path segments
      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        currentPath += `/${segment}`;
        
        // Check if this is an ID segment (typically the last one or followed by "edit")
        const isIdSegment = 
          (i === pathSegments.length - 1 && segment.match(/^[0-9a-fA-F]{24}$/)) || 
          (i < pathSegments.length - 1 && pathSegments[i+1] === 'edit' && segment.match(/^[0-9a-fA-F]{24}$/));
        
        if (isIdSegment) {
          // This is an ID segment, use the previous segment's config for context
          if (i > 0 && routeConfig[pathSegments[i-1]]) {
            const itemType = routeConfig[pathSegments[i-1]].label.replace(/s$/, ''); // Remove plural
            breadcrumbItems.push({
              path: currentPath,
              label: `${itemType} Details`,
            });
          } else {
            breadcrumbItems.push({
              path: currentPath,
              label: 'Details',
            });
          }
          continue;
        }
        
        // Regular named route
        if (routeConfig[segment]) {
          const { label } = routeConfig[segment];
          
          // Add parent first if exists and not already in breadcrumbs
          addParent(segment);
          
          breadcrumbItems.push({
            path: currentPath,
            label,
          });
        } else {
          // Fallback for unknown routes
          breadcrumbItems.push({
            path: currentPath,
            label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          });
        }
      }

      // Remove duplicates
      const unique = breadcrumbItems.filter(
        (item, index, self) => index === self.findIndex((t) => t.path === item.path)
      );

      // Sort by path depth
      unique.sort((a, b) => {
        const depthA = a.path.split('/').filter(Boolean).length;
        const depthB = b.path.split('/').filter(Boolean).length;
        return depthA - depthB;
      });

      return unique;
    };

    setBreadcrumbs(buildBreadcrumbs());
  }, [location]);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumbs" className="mb-4">
      <ol className="flex flex-wrap items-center text-sm">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />}
              {isLast ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {breadcrumb.icon && <span className="mr-1.5 inline-block align-text-bottom">{breadcrumb.icon}</span>}
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className={cn(
                    "text-muted-foreground hover:text-foreground hover:underline",
                    breadcrumb.icon && "flex items-center"
                  )}
                >
                  {breadcrumb.icon && <span className="mr-1.5">{breadcrumb.icon}</span>}
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
