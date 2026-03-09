// context.tsx (updated)
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getLayout16ModuleByPath } from '@/config/layout-16-modules';

const HEADER_HEIGHT = "60px";
const SIDEBAR_WIDTH = "300px";
const SIDEBAR_COLLAPSED_WIDTH = "70px";
const TOOLBAR_HEIGHT = "54px";

// Define the shape of the layout state
interface LayoutState {
  style: React.CSSProperties;
  bodyClassName: string;
  isMobile: boolean;
  isSidebarOpen: boolean;
  sidebarToggle: () => void;
  activeModuleId?: string;
  setActiveModuleId: (id: string | undefined) => void;
  // Add these two lines
  toolbarContent: ReactNode | null;
  setToolbarContent: (content: ReactNode | null) => void;
}

// Create the context
const LayoutContext = createContext<LayoutState | undefined>(undefined);

// Provider component
interface LayoutProviderProps {
  children: ReactNode;
  style?: React.CSSProperties;
  bodyClassName?: string;
}

export function LayoutProvider({ children, style: customStyle, bodyClassName = '' }: LayoutProviderProps) {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // initialize with module from current path or default to CMS
  const [activeModuleId, setActiveModuleId] = useState<string | undefined>(() => {
    const m = getLayout16ModuleByPath(pathname);
    return m?.id || 'cms';
  });

  // 👇 New state for toolbar content
  const [toolbarContent, setToolbarContent] = useState<ReactNode | null>(null);

  const defaultStyle: React.CSSProperties = {
    '--sidebar-width': SIDEBAR_WIDTH,
    '--sidebar-collapsed-width': SIDEBAR_COLLAPSED_WIDTH,
    '--header-height': HEADER_HEIGHT,
    '--toolbar-height': TOOLBAR_HEIGHT,
  } as React.CSSProperties;

  const style: React.CSSProperties = {
    ...defaultStyle,
    ...customStyle,
  };

  // Sidebar toggle function
  const sidebarToggle = () => setIsSidebarOpen((open) => !open);

  // Set body className on mount and clean up on unmount
  useEffect(() => {
    if (bodyClassName) {
      const body = document.body;
      const existingClasses = body.className;
      body.className = `${existingClasses} ${bodyClassName}`.trim();
      return () => {
        body.className = existingClasses;
      };
    }
  }, [bodyClassName]);

  useEffect(() => {
    console.log('pathname changed:', pathname);
    const moduleByPath = getLayout16ModuleByPath(pathname);
    console.log('moduleByPath:', moduleByPath);
    setActiveModuleId(moduleByPath?.id ?? 'cms');
  }, [pathname]);

  return (
    <LayoutContext.Provider
      value={{
        bodyClassName,
        style,
        isMobile,
        isSidebarOpen,
        sidebarToggle,
        activeModuleId,
        setActiveModuleId,
        // 👇 Expose the new state and setter
        toolbarContent,
        setToolbarContent,
      }}
    >
      <div
        data-slot="layout-wrapper"
        className="flex grow"
        data-sidebar-open={isSidebarOpen}
        style={style}
      >
        <TooltipProvider delayDuration={0}>
          {children}
        </TooltipProvider>
      </div>
    </LayoutContext.Provider>
  );
}

// Custom hook for consuming the context
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};