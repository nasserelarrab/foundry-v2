import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { FieldInfo } from './getNestedFields';
import { FilterCondition } from '../FoundryTable';

interface FilterPopoverProps {
  fields: FieldInfo[];
  filters: FilterCondition[];
  onApply: (filters: FilterCondition[]) => void;
  onClose?: () => void;
}

const operatorsByType = {
  string: [
    { value: 'contains', label: 'Contains' },
    { value: 'doesNotContain', label: 'Does not contain' },
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not equals' },
    { value: 'isNull', label: 'Is null' },
    { value: 'isNotNull', label: 'Is not null' },
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not equals' },
    { value: 'greaterThan', label: 'Greater than' },
    { value: 'lessThan', label: 'Less than' },
    { value: 'isNull', label: 'Is null' },
    { value: 'isNotNull', label: 'Is not null' },
  ],
  date: [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not equals' },
    { value: 'greaterThan', label: 'After' },
    { value: 'lessThan', label: 'Before' },
    { value: 'isNull', label: 'Is null' },
    { value: 'isNotNull', label: 'Is not null' },
  ],
  boolean: [
    { value: 'isTrue', label: 'Is true' },
    { value: 'isFalse', label: 'Is false' },
    { value: 'isNull', label: 'Is null' },
    { value: 'isNotNull', label: 'Is not null' },
  ],
};

export function FilterPopover({ fields, filters, onApply, onClose }: FilterPopoverProps) {
  const [conditions, setConditions] = useState<FilterCondition[]>(filters);

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

  const addCondition = () => {
    if (fields.length === 0) return;
    const firstField = fields[0];
    let defaultOp: FilterCondition['operator'] = 'contains';
    if (firstField.type === 'boolean') defaultOp = 'isTrue';
    else if (firstField.type === 'number') defaultOp = 'equals';
    else if (firstField.type === 'date') defaultOp = 'equals';
    setConditions([...conditions, { path: firstField.path, operator: defaultOp, value: '' }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateConditionPath = (index: number, path: string) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], path };
    setConditions(updated);
  };

  const updateConditionOperator = (index: number, operator: string) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], operator: operator as any };
    setConditions(updated);
  };

  const updateConditionValue = (index: number, value: string) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], value };
    setConditions(updated);
  };

  const handleApply = () => {
    const valid = conditions.filter(c => c.value.trim() !== '' || ['isNull', 'isNotNull', 'isTrue', 'isFalse'].includes(c.operator));
    onApply(valid);
    onClose?.();
  };

  const handleClearAll = () => {
    setConditions([]);
    onApply([]);
    onClose?.();
  };

  const getFieldType = (path: string): string => {
    const field = fields.find(f => f.path === path);
    return field?.type || 'string';
  };

  return (
    <div className="p-3 space-y-2 w-72"> {/* reduced padding, spacing */}
      <ScrollArea className="max-h-80 pr-2"> {/* slightly taller to accommodate */}
        <div className="space-y-2"> {/* reduced spacing between condition cards */}
          {conditions.map((cond, idx) => {
            const fieldType = getFieldType(cond.path);
            const operators = operatorsByType[fieldType] || operatorsByType.string;

            let lastGroup: string | null = null;

            return (
              <div key={idx} className="border rounded p-2 relative space-y-2"> {/* smaller padding */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 absolute -top-1.5 -right-1.5 rounded-full bg-background border"
                  onClick={() => removeCondition(idx)}
                >
                  <X className="h-3 w-3" />
                </Button>

                {/* Field selection with group headers */}
                <div className="space-y-1">
                  <Label className="text-[10px]">Field</Label> {/* smaller label */}
                  <ScrollArea className="h-32 border rounded p-1"> {/* smaller height */}
                    <RadioGroup
                      value={cond.path}
                      onValueChange={(val) => updateConditionPath(idx, val)}
                      className="space-y-0.5"
                    >
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
                            <div className="flex items-center space-x-2 py-0 pt-0 pb-0">
                              <RadioGroupItem value={field.path} id={`${idx}-${field.path}`} className="scale-75" />
                              <Label htmlFor={`${idx}-${field.path}`} className="text-xs font-normal cursor-pointer">
                                {field.label}
                              </Label>
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </ScrollArea>
                </div>

                {/* Operator select */}
                <div className="space-y-1">
                  <Label className="text-[10px]">Operator</Label>
                  <Select
                    value={cond.operator}
                    onValueChange={(val) => updateConditionOperator(idx, val)}
                  >
                    <SelectTrigger className="h-7 text-xs"> {/* smaller height, text */}
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map(op => (
                        <SelectItem key={op.value} value={op.value} className="text-xs">
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Value input – only if needed */}
                {!['isNull', 'isNotNull', 'isTrue', 'isFalse'].includes(cond.operator) && (
                  <div className="space-y-1">
                    <Label className="text-[10px]">Value</Label>
                    <Input
                      placeholder="Value"
                      value={cond.value}
                      onChange={(e) => updateConditionValue(idx, e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="flex justify-between pt-1"> {/* reduced top padding */}
        <Button variant="outline" size="sm" onClick={addCondition} className="text-xs h-7 px-2">
          Add filter
        </Button>
        <div className="space-x-1">
          <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-xs h-7 px-2">
            Clear
          </Button>
          <Button size="sm" onClick={handleApply} className="text-xs h-7 px-3">
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}