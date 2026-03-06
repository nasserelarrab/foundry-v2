import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { SortingState } from '@tanstack/react-table';

interface SortPopoverProps {
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  columns: Array<{ id: string; header: string }>;
  onClose?: () => void;
}

export function SortPopover({ sorting, onSortingChange, columns, onClose }: SortPopoverProps) {
  const currentSort = sorting[0] || null;

  const handleColumnChange = (columnId: string) => {
    const desc = currentSort?.id === columnId ? currentSort.desc : false;
    onSortingChange([{ id: columnId, desc }]);
  };

  const handleDescChange = (checked: boolean) => {
    if (currentSort) {
      onSortingChange([{ ...currentSort, desc: checked }]);
    }
  };

  return (
    <div className="p-4 space-y-4 w-64">
      <div className="space-y-2">
        <Label>Sort by</Label>
        <RadioGroup value={currentSort?.id} onValueChange={handleColumnChange}>
          {columns.map(col => (
            <div key={col.id} className="flex items-center space-x-2">
              <RadioGroupItem value={col.id} id={`sort-${col.id}`} />
              <Label htmlFor={`sort-${col.id}`}>{col.header}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {currentSort && (
        <div className="flex items-center justify-between">
          <Label htmlFor="sort-desc">Descending</Label>
          <Switch
            id="sort-desc"
            checked={currentSort.desc}
            onCheckedChange={handleDescChange}
          />
        </div>
      )}

      <Button className="w-full" onClick={onClose}>
        Apply
      </Button>
    </div>
  );
}