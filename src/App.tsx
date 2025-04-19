import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Index from './pages/Index';
import MedicalRecords from './pages/MedicalRecords';
import AppointmentBooking from './pages/AppointmentBooking';
import MedicationTracker from './pages/MedicationTracker';
import Emergency from './pages/Emergency';
import HelpSupport from './pages/HelpSupport';
import Settings from './pages/Settings';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';
import NotFound from './pages/NotFound';
import CommandMenu from './components/CommandMenu';
import NetworkStatus from './components/NetworkStatus';
import { StatusIndicator } from './components/StatusIndicator';
import { StatusProvider } from './contexts/StatusContext';
import { ActionHistoryProvider } from './contexts/ActionHistoryContext';

// Scroll to top component for better UX - Consistency & Standards (Nielsen's Heuristic #4)
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Skip to content link for accessibility - matches real world (Nielsen's Heuristic #2)
function SkipToContent() {
  return (
    <a href="#main-content" className="skip-to-content">
      Skip to content
    </a>
  );
}

function App() {
  // Register keyboard shortcuts - Flexibility and efficiency (Nielsen's Heuristic #7)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only activate shortcuts when not in input/textarea elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Common shortcuts following systems users already know
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '/': // Search shortcut
            e.preventDefault();
            document.querySelector<HTMLInputElement>('input[aria-label="Search"]')?.focus();
            break;
          case ',': // Settings shortcut
            e.preventDefault();
            window.location.href = '/settings';
            break;
          case 'e': // Emergency shortcut
            e.preventDefault();
            window.location.href = '/emergency';
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ErrorBoundary>
      <ActionHistoryProvider>
        <StatusProvider>
          <Router>
            <SkipToContent />
            <ScrollToTop />
            <CommandMenu />
            <NetworkStatus />
            <main id="main-content">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/records" element={<MedicalRecords />} />
                <Route path="/appointments" element={<AppointmentBooking />} />
                <Route path="/medications" element={<MedicationTracker />} />
                <Route path="/emergency" element={<Emergency />} />
                <Route path="/help" element={<HelpSupport />} />
                <Route path="/settings" element={<Settings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Toaster />
          </Router>
        </StatusProvider>
      </ActionHistoryProvider>
    </ErrorBoundary>
  );
}

export default App;
