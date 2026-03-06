import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ColumnFiltersState } from '@tanstack/react-table';
import { X } from 'lucide-react';

interface FilterCondition {
  id: string;          // column id
  operator: string;
  value: string;
}

interface FilterPopoverProps {
  columnFilters: ColumnFiltersState;
  onApply: (filters: ColumnFiltersState) => void;
  columns: Array<{ id: string; header: string; dataType?: string }>;
  onClose?: () => void;
}

const operatorsByType = {
  string: ['contains', 'equals'],
  number: ['equals', 'greaterThan', 'lessThan'],
};

export function FilterPopover({ columnFilters, onApply, columns, onClose }: FilterPopoverProps) {
  // Convert current columnFilters (which store { operator, value }) to our draft format
  const [conditions, setConditions] = useState<FilterCondition[]>(() => {
    return columnFilters.map(filter => ({
      id: filter.id,
      ...(filter.value as { operator: string; value: string }),
    }));
  });

  const addCondition = () => {
    if (columns.length === 0) return;
    setConditions([...conditions, { id: columns[0].id, operator: 'contains', value: '' }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, field: keyof FilterCondition, newValue: string) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], [field]: newValue };
    setConditions(updated);
  };

  const handleApply = () => {
    // Convert draft to ColumnFiltersState: only include conditions with non-empty value
    const newFilters = conditions
      .filter(c => c.value.trim() !== '')
      .map(c => ({
        id: c.id,
        value: { operator: c.operator, value: c.value },
      }));
    onApply(newFilters);
    onClose?.();
  };

  const handleClearAll = () => {
    setConditions([]);
    onApply([]);
    onClose?.();
  };

  return (
    <div className="p-4 space-y-4 w-80">
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {conditions.map((cond, idx) => {
          const colDef = columns.find(c => c.id === cond.id) || columns[0];
          const operators = operatorsByType[colDef.dataType || 'string'] || operatorsByType.string;

          return (
            <div key={idx} className="flex items-start gap-2 border rounded p-2 relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 absolute -top-2 -right-2 rounded-full bg-background border"
                onClick={() => removeCondition(idx)}
              >
                <X className="h-3 w-3" />
              </Button>

              <div className="flex-1 space-y-2">
                <Select
                  value={cond.id}
                  onValueChange={(val) => updateCondition(idx, 'id', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Column" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map(col => (
                      <SelectItem key={col.id} value={col.id}>{col.header}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={cond.operator}
                  onValueChange={(val) => updateCondition(idx, 'operator', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map(op => (
                      <SelectItem key={op} value={op}>{op}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Value"
                  value={cond.value}
                  onChange={(e) => updateCondition(idx, 'value', e.target.value)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={addCondition}>
          Add filter
        </Button>
        <div className="space-x-2">
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            Clear
          </Button>
          <Button size="sm" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}