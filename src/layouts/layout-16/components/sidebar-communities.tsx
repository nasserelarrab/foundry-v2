import { useMemo } from "react";
import { Link } from "react-router";
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

export function SidebarCommunities() {
  const { activeModuleId } = useLayout();

  const moduleCommunityItems = useMemo(() => {
    const moduleConfig = getLayout16ModuleById(activeModuleId);
    return (
      moduleConfig?.secondaryItems.filter((x) => x.section === 'communities') ?? []
    );
  }, [activeModuleId]);

  return (
    <AccordionMenu
      type="single"
      collapsible
      defaultValue="communities-trigger"
      selectedValue="communities-trigger"
      className="space-y-7.5 px-2.5"
      classNames={{
        item: 'h-8.5 px-2.5 text-sm font-normal text-foreground hover:text-primary hover:bg-background data-[selected=true]:bg-background data-[selected=true]:text-foreground [&[data-selected=true]_svg]:opacity-100',
        subTrigger: 'text-xs font-normal text-muted-foreground hover:bg-transparent',
        subContent: 'ps-0',
      }}
    >
        <AccordionMenuSub value="communities">
          <AccordionMenuSubTrigger value="communities-trigger">
            <span>Communities</span>
            <AccordionMenuIndicator />
          </AccordionMenuSubTrigger>
          <AccordionMenuSubContent type="single" collapsible parentValue="communities-trigger">
            {moduleCommunityItems.map((child) => {
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
