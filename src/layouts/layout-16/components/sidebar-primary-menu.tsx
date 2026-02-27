import { useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router";
import { getLayout16ModuleById } from "@/config/layout-16-modules";
import { useLayout } from "./context";
import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuItem,
  AccordionMenuLabel
} from '@/components/ui/accordion-menu';
import { Badge } from '@/components/ui/badge';

export function SidebarPrimaryMenu() {
  const { pathname } = useLocation();
  const { activeModuleId } = useLayout();

  const modulePrimaryItems = useMemo(() => {
    const moduleConfig = getLayout16ModuleById(activeModuleId);
    return (
      moduleConfig?.secondaryItems.filter((x) => x.section === 'primary') ?? []
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
      selectedValue={pathname}
      matchPath={matchPath}
      type="multiple"
      className="space-y-7.5 px-2.5"
      classNames={{
        label: 'text-xs font-normal text-muted-foreground mb-2',
        item: 'h-8.5 px-2.5 text-sm font-normal text-foreground hover:text-primary data-[selected=true]:bg-background hover:bg-background data-[selected=true]:text-foreground [&[data-selected=true]_svg]:opacity-100',
        group: '',
      }}
    >
      <AccordionMenuGroup>
        <AccordionMenuLabel></AccordionMenuLabel>
        {modulePrimaryItems.map((child) => {
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
      </AccordionMenuGroup>
    </AccordionMenu>
  );
}
