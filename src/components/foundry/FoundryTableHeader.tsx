import React, { useState } from 'react';
import styles from '@/styles/foundryTableHeader.module.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Settings2 } from 'lucide-react';

interface FoundryTableHeaderProps {
  /** current search text */
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  /** active filter tab (All/Live/Drafts/Scheduled) */
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  /** number shown inside the filters badge */
  filtersCount?: number;
  /** optional: callback for columns visibility (from DataGrid context) */
  onColumnsClick?: () => void;
  /** optional: shown columns for display in the popover */
  visibleColumns?: { [key: string]: boolean };
  onColumnToggle?: (columnId: string, visible: boolean) => void;
}

const defaultTabs = ['All', 'Live', 'Drafts', 'Scheduled'];

export default function FoundryTableHeader({
  searchQuery = '',
  onSearchChange,
  activeTab,
  onTabChange,
  filtersCount = 0,
  onColumnsClick,
  visibleColumns,
  onColumnToggle,
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
    <div
    
      style={{
        borderTop: '1px solid #eee',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '54px',
        padding: '0 15px 0 15px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Search input - using existing Input component for consistency */}
        <div style={{ position: 'relative' }}>
          <Input
            type="text"
            placeholder="Search pages…"
            value={internalSearch}
            onChange={handleSearch}
            style={{
              paddingLeft: '32px',
              width: '200px',
              height: '34px',
            }}
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8e9198',
            }}
          >
            <path
              d="M6 0C9.31358 0 11.9998 2.68647 12 6C12 7.45266 11.4831 8.78421 10.624 9.82227L13.0674 12.2666C13.2887 12.4879 13.2887 12.8461 13.0674 13.0674C12.8461 13.2886 12.4879 13.2887 12.2666 13.0674L9.82227 10.624C8.78421 11.483 7.45264 12 6 12C2.68649 11.9998 0 9.31357 0 6C0.000207643 2.68661 2.68662 0.000230965 6 0ZM6 1.1123C3.30077 1.11254 1.11251 3.30076 1.1123 6C1.1123 8.69941 3.30064 10.8884 6 10.8887C8.69955 10.8887 10.8887 8.69955 10.8887 6C10.8885 3.30062 8.69943 1.1123 6 1.1123Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Filter tabs */}
        <div
          style={{
            background: '#f4f4f4',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px',
            height: '34px',
          }}
        >
          {defaultTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              style={{
                background: tab === currentTab ? '#fff' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                color: tab === currentTab ? '#2c2d30' : '#676a72',
                fontFamily: 'Arimo, sans-serif',
                boxShadow:
                  tab === currentTab
                    ? '0 1px 3px #0000001a, 0 1px 2px -1px #0000001a'
                    : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Right-side buttons - aligned to the end */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Sort button */}
        <Button
          variant="outline"
          size="lg"
          style={{
            height: '28px',
            padding: '7px 10px',
            display: 'flex',
            gap: '4px',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.1"
              d="M10.7307 0.699974H3.32002C2.8572 0.699974 2.41333 0.883829 2.08607 1.21109C1.75881 1.53836 1.57495 1.98222 1.57495 2.44504V3.87018C1.57836 4.32312 1.75775 4.75699 2.0752 5.08009L4.26235 7.29632C4.59606 7.63377 4.78225 8.08983 4.78006 8.56441V11.6183C4.7793 11.9163 4.86093 12.2088 5.01593 12.4633C5.17093 12.7179 5.39328 12.9247 5.65841 13.0609C5.92347 13.1971 6.22074 13.2583 6.51807 13.2378C6.81539 13.2173 7.10145 13.1159 7.3453 12.9445L8.1364 12.3628C8.33943 12.2195 8.5051 12.0295 8.61947 11.8088C8.73385 11.5882 8.7936 11.3433 8.79371 11.0948V8.65166C8.79121 8.39859 8.84167 8.1478 8.94185 7.91539C9.04203 7.68298 9.1897 7.47409 9.3754 7.30214L11.8359 5.10917C12.0178 4.94654 12.1635 4.74759 12.2637 4.52517C12.3639 4.30274 12.4163 4.06177 12.4176 3.81783V2.42177C12.4119 1.97289 12.2334 1.54349 11.9192 1.22283C11.6051 0.90216 11.1794 0.714901 10.7307 0.699974Z"
              fill="#8E9198"
            />
            <path
              d="M10.7307 0.729164H3.32002C2.8572 0.729164 2.41333 0.913019 2.08607 1.24028C1.75881 1.56755 1.57495 2.01141 1.57495 2.47423V3.89937C1.57836 4.35231 1.75775 4.78618 2.0752 5.10928L4.26235 7.32551C4.59606 7.66296 4.78225 8.11902 4.78006 8.5936V11.6475C4.7793 11.9455 4.86093 12.238 5.01593 12.4925C5.17093 12.7471 5.39328 12.9539 5.65841 13.09C5.92347 13.2263 6.22074 13.2875 6.51807 13.267C6.81539 13.2465 7.10145 13.145 7.3453 12.9737L8.1364 12.392C8.33943 12.2487 8.5051 12.0587 8.61947 11.838C8.73385 11.6174 8.7936 11.3725 8.79371 11.1239V8.68085C8.79121 8.42778 8.84167 8.17699 8.94185 7.94458C9.04203 7.71217 9.1897 7.50328 9.3754 7.33133L11.8359 5.13836C12.0178 4.97573 12.1635 4.77678 12.2637 4.55436C12.3639 4.33193 12.4163 4.09096 12.4176 3.84702V2.45096C12.4119 2.00208 12.2334 1.57268 11.9192 1.25202C11.6051 0.93135 11.1794 0.744091 10.7307 0.729164ZM2.46493 3.89937V2.45096C2.46493 2.33894 2.48709 2.22803 2.53013 2.12461C2.57318 2.0212 2.63625 1.92731 2.71573 1.84838C2.79521 1.76944 2.88952 1.707 2.99323 1.66467C3.09694 1.62233 3.208 1.60093 3.32002 1.6017H6.10631L3.64576 5.44084L2.71506 4.49851C2.63559 4.42031 2.57254 4.32704 2.52959 4.22416C2.48664 4.12128 2.46466 4.01085 2.46493 3.89937ZM11.58 3.84702C11.5807 3.96725 11.5562 4.08631 11.5082 4.19652C11.4601 4.30672 11.3894 4.40563 11.3008 4.48687L8.83443 6.67984C8.55257 6.93145 8.32707 7.23977 8.17269 7.58462C8.01831 7.92946 7.93855 8.30303 7.93863 8.68085V11.1356C7.93843 11.2437 7.91248 11.3502 7.86291 11.4463C7.81334 11.5424 7.74159 11.6253 7.6536 11.6882L6.85668 12.2699C6.74468 12.3437 6.61491 12.3862 6.48089 12.3929C6.34688 12.3996 6.21352 12.3702 6.09472 12.3079C5.97592 12.2455 5.87601 12.1524 5.80541 12.0383C5.73481 11.9242 5.6961 11.7932 5.69331 11.6591V8.5936C5.69405 7.89078 5.41824 7.21588 4.92548 6.71474L4.27399 6.0807L7.14753 1.6017H10.7307C10.8423 1.6017 10.9527 1.62366 11.0557 1.66634C11.1588 1.70902 11.2524 1.77158 11.3313 1.85044C11.4101 1.9293 11.4727 2.02293 11.5153 2.12596C11.558 2.229 11.58 2.33944 11.58 2.45096V3.84702Z"
              fill="#8E9198"
            />
          </svg>
          <span style={{ fontSize: '0.6875rem;', fontWeight: 500 }}>Sort</span>
        </Button>

        {/* Filters button with badge */}
        <Button
          variant="outline"
          size="lg"
          style={{
            height: '28px',
            padding: '7px 10px',
            display: 'flex',
            gap: '4px',
            position: 'relative',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.9999 2.66666H9.33325M6.66667 2.66666H2M14 8H8M5.33333 8H2M14.0001 13.3333H10.6667M8 13.3333H2M9.33325 1.33334V4M5.33325 6.66666V9.33333M10.6667 12V14.6667"
              stroke="#8E9198"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: '0.6875rem;', fontWeight: 500 }}>Filters</span>
          {filtersCount > 0 && (
            <span
              style={{
                background: '#2c2d30',
                color: '#fff',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                marginLeft: '4px',
              }}
            >
              {filtersCount}
            </span>
          )}
        </Button>

        {/* Columns button - with popover for visibility toggle */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              style={{
                height: '28px',
                padding: '7px 10px',
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
                background:'black',
              }}
            >
              {/* New SVG icon for columns */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.4634 13.9999H11.6439C11.2273 13.9999 10.8278 13.8344 10.5332 13.5399C10.2387 13.2453 10.0732 12.8458 10.0732 12.4292V6.99997C10.0732 6.58276 10.2384 6.18253 10.5328 5.88688C10.8272 5.59122 11.2267 5.42422 11.6439 5.42241H12.4634C12.8747 5.4331 13.2655 5.60401 13.5525 5.89871C13.8396 6.19341 14.0001 6.58858 14 6.99997V12.4634C13.9913 12.8682 13.8266 13.2539 13.5403 13.5402C13.254 13.8265 12.8682 13.9912 12.4634 13.9999ZM11.6439 6.48778C11.5047 6.4875 11.3707 6.54035 11.2692 6.63554C11.1676 6.73072 11.1063 6.86107 11.0976 6.99997V12.4634C11.0976 12.6083 11.1551 12.7472 11.2576 12.8497C11.36 12.9521 11.499 13.0097 11.6439 13.0097H12.4634C12.6083 13.0097 12.7473 12.9521 12.8497 12.8497C12.9522 12.7472 13.0098 12.6083 13.0098 12.4634V6.99997C13.0107 6.92765 12.9972 6.85587 12.9701 6.7888C12.9431 6.72172 12.903 6.66068 12.8522 6.60923C12.8013 6.55777 12.7408 6.51691 12.6741 6.48903C12.6073 6.46115 12.5357 6.44679 12.4634 6.4468L11.6439 6.48778ZM7.49854 13.9999H6.67902C6.27012 13.9982 5.87816 13.8364 5.58712 13.5492C5.29607 13.262 5.12909 12.8722 5.12195 12.4634V6.99997C5.12195 6.58638 5.28578 6.18963 5.57759 5.89653C5.8694 5.60344 6.26544 5.43788 6.67902 5.43607H7.46439C7.67123 5.43427 7.8764 5.47335 8.0681 5.55105C8.2598 5.62875 8.43427 5.74355 8.58149 5.88886C8.7287 6.03418 8.84577 6.20713 8.92596 6.39781C9.00615 6.58848 9.04789 6.79312 9.04878 6.99997V12.4634C9.03982 12.8764 8.86851 13.2692 8.57195 13.5568C8.2754 13.8444 7.87748 14.0036 7.46439 13.9999H7.49854ZM6.71317 6.48778C6.57127 6.48957 6.43579 6.5472 6.33608 6.64819C6.23638 6.74917 6.18048 6.88537 6.18049 7.02729V12.4634C6.17958 12.5339 6.19269 12.6039 6.21906 12.6693C6.24542 12.7347 6.28452 12.7943 6.33407 12.8444C6.38363 12.8946 6.44265 12.9345 6.50773 12.9617C6.57281 12.9889 6.64264 13.0029 6.71317 13.0029H7.49854C7.64162 13.0029 7.77885 12.946 7.88003 12.8448C7.98121 12.7437 8.03805 12.6064 8.03805 12.4634V6.99997C8.03805 6.85688 7.98121 6.71966 7.88003 6.61848C7.77885 6.5173 7.64162 6.46046 7.49854 6.46046L6.71317 6.48778ZM2.51317 13.9999H1.59122C1.16976 13.9981 0.766066 13.8299 0.468043 13.5319C0.17002 13.2339 0.00179731 12.8302 0 12.4087V7.04094C0.00179731 6.61948 0.17002 6.21579 0.468043 5.91777C0.766066 5.61975 1.16976 5.45153 1.59122 5.44973H2.47902C2.90049 5.45153 3.30418 5.61975 3.6022 5.91777C3.90022 6.21579 4.06845 6.61948 4.07024 7.04094V12.4087C4.06845 12.8302 3.90022 13.2339 3.6022 13.5319C3.30418 13.8299 2.90049 13.9981 2.47902 13.9999H2.51317ZM1.62537 6.48778C1.47503 6.48778 1.33086 6.54749 1.22456 6.6538C1.11826 6.7601 1.05854 6.90427 1.05854 7.0546V12.4224C1.05854 12.5727 1.11826 12.7169 1.22456 12.8232C1.33086 12.9295 1.47503 12.9892 1.62537 12.9892H2.51317C2.6635 12.9892 2.80768 12.9295 2.91398 12.8232C3.02028 12.7169 3.08 12.5727 3.08 12.4224V7.04094C3.08 6.89061 3.02028 6.74644 2.91398 6.64014C2.80768 6.53384 2.6635 6.47412 2.51317 6.47412L1.62537 6.48778ZM12.3268 4.439H1.70732C1.25451 4.439 0.820246 4.25913 0.500062 3.93895C0.179877 3.61876 0 3.1845 0 2.73169V1.70731C0 1.2545 0.179877 0.820242 0.500062 0.500059C0.820246 0.179877 1.25451 0 1.70732 0H12.2927C12.7455 0 13.1798 0.179877 13.4999 0.500059C13.8201 0.820242 14 1.2545 14 1.70731V2.73169C14 3.1845 13.8201 3.61876 13.4999 3.93895C13.1798 4.25913 12.7455 4.439 12.2927 4.439H12.3268ZM1.74146 1.02439C1.56034 1.02439 1.38663 1.09634 1.25856 1.22441C1.13049 1.35248 1.05854 1.52619 1.05854 1.70731V2.73169C1.05854 2.91282 1.13049 3.08652 1.25856 3.21459C1.38663 3.34267 1.56034 3.41462 1.74146 3.41462H12.3268C12.508 3.41462 12.6817 3.34267 12.8097 3.21459C12.9378 3.08652 13.0098 2.91282 13.0098 2.73169V1.70731C13.0098 1.52619 12.9378 1.35248 12.8097 1.22441C12.6817 1.09634 12.508 1.02439 12.3268 1.02439H1.74146Z"
                  fill="#ffffff"
                />
              </svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="end">
            <div className="space-y-3">
              <div className="text-xs font-medium text-muted-foreground">
                Show/Hide Columns
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {visibleColumns ? (
                  Object.entries(visibleColumns).map(([colId, visible]) => (
                    <div key={colId} className="flex items-center gap-2">
                      <Checkbox
                        id={`col-${colId}`}
                        checked={visible}
                        onCheckedChange={(checked) =>
                          onColumnToggle?.(colId, checked === true)
                        }
                      />
                      <Label
                        htmlFor={`col-${colId}`}
                        className="text-sm font-normal cursor-pointer capitalize"
                      >
                        {colId.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No columns available
                  </p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
