import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, ArrowUpDown, Columns2 } from 'lucide-react';
import { SortPopover } from './SortPopover';
import { FilterPopover } from './FilterPopover';
import { FieldInfo } from './getNestedFields'; // adjust import path as needed
import { FilterCondition, SortConfig } from '../FoundryTable'; // adjust import
import { Sort,Filter,Columns } from '@/components/icons';
interface FoundryTableHeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  visibleColumns?: { [key: string]: boolean };
  onColumnToggle?: (columnId: string, visible: boolean) => void;
  // New props for dynamic sort/filter
  fields: FieldInfo[];
  customSort: SortConfig | null;
  onSortChange: (sort: SortConfig | null) => void;
  customFilters: FilterCondition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
}

const defaultTabs = ['All', 'Live', 'Drafts', 'Scheduled'];

export default function FoundryTableHeader({
  searchQuery = '',
  onSearchChange,
  activeTab,
  onTabChange,
  visibleColumns,
  onColumnToggle,
  fields,
  customSort,
  onSortChange,
  customFilters,
  onFiltersChange,
}: FoundryTableHeaderProps) {
  const [internalSearch, setInternalSearch] = useState(searchQuery);
  const [currentTab, setCurrentTab] = useState(activeTab || defaultTabs[0]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalSearch(e.target.value);
    onSearchChange?.(e.target.value);
  };

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', width: '100%' }}>
      {/* Left side: search + tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              pointerEvents: 'none',
            }}
          />
          <Input
            type="text"
            placeholder="Search pages…"
            value={internalSearch}
            onChange={handleSearch}
            style={{ paddingLeft: '32px', width: '200px', height: '34px' }}
          />
        </div>

        <div style={{ background: '#f4f4f4', borderRadius: '6px', display: 'flex', padding: '2px' }}>
          {defaultTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              style={{
                padding: '4px 12px',
                background: currentTab === tab ? '#fff' : 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: currentTab === tab ? 500 : 400,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Right side buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
        {/* Sort button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" style={{ height: '28px', gap: '4px' }}>
              <Sort size={14} />
              <span>Sort</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <SortPopover
              fields={fields}
              currentSort={customSort}
              onSortChange={onSortChange}
              onClose={() => {}} // optional
            />
          </PopoverContent>
        </Popover>

        {/* Filters button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" style={{ height: '28px', gap: '4px' }}>
              <Filter size={14} />
              <span>Filters</span>
              {customFilters.length > 0 && (
                <span
                  style={{
                    background: '#2c2d30',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    fontSize: '10px',
                    marginLeft: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {customFilters.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <FilterPopover
              fields={fields}
              filters={customFilters}
              onApply={onFiltersChange}
              onClose={() => {}}
            />
          </PopoverContent>
        </Popover>

        {/* Columns button (unchanged) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" style={{ height: '28px', padding: '7px 10px', background: 'black' }}>
              <Columns size={14} className="text-white" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="end">
            <div className="space-y-3">
              <div className="text-xs font-medium">Show/Hide Columns</div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {visibleColumns ? (
                  Object.entries(visibleColumns).map(([colId, visible]) => (
                    <div key={colId} className="flex items-center gap-2">
                      <Checkbox
                        id={`col-${colId}`}
                        checked={visible}
                        onCheckedChange={(checked) => onColumnToggle?.(colId, checked === true)}
                      />
                      <Label htmlFor={`col-${colId}`} className="text-sm font-normal capitalize">
                        {colId.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No columns available</p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}