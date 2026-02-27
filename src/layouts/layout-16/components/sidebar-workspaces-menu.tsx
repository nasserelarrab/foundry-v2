import { useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router";
import { getLayout16ModuleById } from "@/config/layout-16-modules";
import { useLayout } from "./context";
import {
  AccordionMenu,
  AccordionMenuIndicator,
  AccordionMenuSub,
  AccordionMenuSubTrigger,
  AccordionMenuSubContent,
  AccordionMenuItem,
} from '@/components/ui/accordion-menu';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus } from "lucide-react";

export function SidebarWorkspacesMenu() {
  const { pathname } = useLocation();
  const { activeModuleId } = useLayout();

  const moduleWorkspaceItems = useMemo(() => {
    const moduleConfig = getLayout16ModuleById(activeModuleId);
    return (
      moduleConfig?.secondaryItems.filter((x) => x.section === 'workspaces') ?? []
    );
  }, [activeModuleId]);

  // Memoize matchPath to prevent unnecessary re-renders
  const matchPath = useCallback(
    (path: string): boolean =>
      path === pathname || (path.length > 1 && pathname.startsWith(path) && path !== '/layout-16'),
    [pathname],
  );

  return (
    <AccordionMenu
      selectedValue="workspace-trigger"
      matchPath={matchPath}
      type="single"
      collapsible
      defaultValue="workspace-trigger"
      className="space-y-7.5 px-2.5"
      classNames={{
        item: 'h-8.5 px-2.5 text-sm font-normal text-foreground hover:text-primary hover:bg-background data-[selected=true]:bg-background data-[selected=true]:text-foreground [&[data-selected=true]_svg]:opacity-100',
        subTrigger: 'text-xs font-normal text-muted-foreground hover:bg-transparent group [&_[data-slot="accordion-menu-sub-indicator"]]:hidden',
        subContent: 'ps-0',
        indicator: 'ms-auto flex items-center font-medium',
      }}
    >
      <AccordionMenuSub value="workspaces">
        <AccordionMenuSubTrigger value="workspace-trigger">
          <span>Workspaces</span>
          <AccordionMenuIndicator>
            <Plus className="size-3.5 shrink-0 transition-transform duration-200 hidden group-data-[state=open]:block" />
            <Minus className="size-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]:hidden" />
          </AccordionMenuIndicator>
        </AccordionMenuSubTrigger>

        <AccordionMenuSubContent type="single" collapsible parentValue="workspace-trigger">
          {moduleWorkspaceItems.map((child) => {
            const enabled = child.enabled !== false;
            return (
              <AccordionMenuItem
                key={child.id}
                value={child.path || '#'}
                disabled={!enabled}
              >
                {enabled ? (
                  <Link to={child.path || '#'}>
                    {child.icon && <child.icon />}
                    <span>{child.title}</span>
                    {child.badge && (
                      <Badge
                        size="sm"
                        variant="secondary"
                        appearance="light"
                        className="ms-auto"
                      >
                        {child.badge}
                      </Badge>
                    )}
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    {child.icon && <child.icon />}
                    <span>{child.title}</span>
                    <Badge size="sm" variant="secondary" className="ms-auto">
                      Soon
                    </Badge>
                  </div>
                )}
              </AccordionMenuItem>
            );
          })}
        </AccordionMenuSubContent>
      </AccordionMenuSub>
    </AccordionMenu>
  );
}
