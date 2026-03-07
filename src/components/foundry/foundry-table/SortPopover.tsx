import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FieldInfo } from './getNestedFields';
import { SortConfig } from '../FoundryTable';

interface SortPopoverProps {
  fields: FieldInfo[];
  currentSort: SortConfig | null;
  onSortChange: (sort: SortConfig | null) => void;
  onClose?: () => void;
}

export function SortPopover({ fields, currentSort, onSortChange, onClose }: SortPopoverProps) {
  const [direction, setDirection] = useState<boolean>(currentSort?.desc || false);
  const [selectedPath, setSelectedPath] = useState<string>(currentSort?.path || '');

  useEffect(() => {
    if (currentSort) {
      setSelectedPath(currentSort.path);
      setDirection(currentSort.desc);
    } else {
      setSelectedPath('');
      // Keep direction as is
    }
  }, [currentSort]);

  const sortedFields = useMemo(() => {
    return [...fields].sort((a, b) => {
      if (a.group === b.group) return a.label.localeCompare(b.label);
      return (a.group || '').localeCompare(b.group || '');
    });
  }, [fields]);

  const groupIsNested = useMemo(() => {
    const map = new Map<string, boolean>();
    fields.forEach(f => {
      if (!f.group) return;
      const isNested = f.path.includes('.');
      map.set(f.group, (map.get(f.group) || false) || isNested);
    });
    return map;
  }, [fields]);

  const handleColumnChange = (path: string) => {
    setSelectedPath(path);
    onSortChange({ path, desc: direction });
  };

  const handleDescChange = (checked: boolean) => {
    setDirection(checked);
    if (selectedPath) {
      onSortChange({ path: selectedPath, desc: checked });
    }
    // If no field selected, direction is stored for future selection
  };

  const handleClear = () => {
    setSelectedPath('');
    onSortChange(null);
    // direction remains unchanged
  };

  let lastGroup: string | null = null;

  return (
    <div className="p-3 space-y-2 w-64">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Sort by</Label>
          {selectedPath && (
            <Button variant="ghost" size="sm" onClick={handleClear} className="h-auto px-2 py-0.5 text-xs">
              Clear
            </Button>
          )}
        </div>
        <ScrollArea className="h-56 pr-2">
          <RadioGroup value={selectedPath} onValueChange={handleColumnChange} className="space-y-0.5">
            {sortedFields.map(field => {
              const showHeader = field.group && field.group !== lastGroup && groupIsNested.get(field.group);
              lastGroup = field.group || null;
              return (
                <div key={field.path}>
                  {showHeader && (
                    <div className="text-[10px] text-muted-foreground font-medium mt-1 first:mt-0">
                      {field.group}
                    </div>
                  )}
                  <div className="flex items-center space-x-2 py-0.5">
                    <RadioGroupItem value={field.path} id={field.path} className="scale-75" />
                    <Label htmlFor={field.path} className="text-xs font-normal cursor-pointer">
                      {field.label}
                    </Label>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        </ScrollArea>
      </div>

      <div className="flex items-center justify-between pt-1">
        <Label htmlFor="sort-desc" className="text-xs">Descending</Label>
        <Switch
          id="sort-desc"
          checked={direction}
          onCheckedChange={handleDescChange}
          className="scale-75 origin-right"
        />
      </div>

      {/* Hint when no field is selected */}
      {!selectedPath && (
        <p className="text-[10px] text-muted-foreground text-center">
          Direction saved – will apply when you select a field.
        </p>
      )}

      <Button className="w-full text-xs h-7" onClick={onClose}>
        Apply
      </Button>
    </div>
  );
}