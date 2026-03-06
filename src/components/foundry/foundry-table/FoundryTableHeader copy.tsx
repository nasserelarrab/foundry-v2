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
import { SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { SortPopover } from './SortPopover';
import { FilterPopover } from './FilterPopover';

interface FoundryTableHeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  filtersCount?: number;
  visibleColumns?: { [key: string]: boolean };
  onColumnToggle?: (columnId: string, visible: boolean) => void;
  // New props
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  sortableColumns: Array<{ id: string; header: string }>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: (filters: ColumnFiltersState) => void;
  filterableColumns: Array<{ id: string; header: string; dataType?: string }>;
}

const defaultTabs = ['All', 'Live', 'Drafts', 'Scheduled'];

export default function FoundryTableHeader({
  searchQuery = '',
  onSearchChange,
  activeTab,
  onTabChange,
  filtersCount = 0,
  visibleColumns,
  onColumnToggle,
  sorting,
  onSortingChange,
  sortableColumns,
  columnFilters,
  onColumnFiltersChange,
  filterableColumns,
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px' }}>
      {/* Left side: search + tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ position: 'relative' }}>
          <Input
            type="text"
            placeholder="Search pages…"
            value={internalSearch}
            onChange={handleSearch}
            style={{ paddingLeft: '32px', width: '200px', height: '34px' }}
          />
          {/* search icon svg - you can add it here */}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Sort button with popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="lg" style={{ height: '28px', padding: '7px 10px', gap: '4px' }}>
              <svg>...</svg>
              <span>Sort</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <SortPopover
              sorting={sorting}
              onSortingChange={onSortingChange}
              columns={sortableColumns}
              onClose={() => {}} // optional, you can manage popover close state if needed
            />
          </PopoverContent>
        </Popover>

        {/* Filters button with badge and popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="lg" style={{ height: '28px', padding: '7px 10px', gap: '4px' }}>
              <svg>...</svg>
              <span>Filters</span>
              {columnFilters.length > 0 && (
                <span style={{ background: '#2c2d30', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', marginLeft: '4px' }}>
                  {columnFilters.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <FilterPopover
              columnFilters={columnFilters}
              onApply={onColumnFiltersChange}
              columns={filterableColumns}
              onClose={() => {}}
            />
          </PopoverContent>
        </Popover>

        {/* Columns button with popover – unchanged */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="lg" style={{ height: '28px', padding: '7px 10px', background: 'black' }}>
              <svg>...</svg>
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