import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuItem,
  AccordionMenuLabel,
} from '@/components/ui/accordion-menu';
import { useLayout } from './context';
import { getLayout16ModuleById } from '@/config/layout-16-modules';

export function SidebarModulesSecondaryMenu() {
  const { pathname } = useLocation();
  const { activeModuleId } = useLayout();

  const moduleConfig = getLayout16ModuleById(activeModuleId);

  const matchPath = useCallback(
    (path: string): boolean =>
      path === pathname || (path.length > 1 && pathname.startsWith(path)),
    [pathname],
  );

  if (!moduleConfig) return null;

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
        <AccordionMenuLabel>{moduleConfig.title}</AccordionMenuLabel>
        {moduleConfig.secondaryItems.map((child) => {
          const enabled = child.enabled !== false;
          return (
            <AccordionMenuItem
              key={child.id}
              value={child.path || '#'}
              disabled={!enabled}
            >
              {enabled ? (
                <Link to={child.path || '#'}>
                  <span>{child.title}</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2 w-full">
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
