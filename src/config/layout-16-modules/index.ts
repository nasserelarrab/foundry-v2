import { BOOKKEEPING_MODULE } from './bookkeeping.config';
import { CALENDAR_MODULE } from './calendar.config';
import { CMS_MODULE } from './cms.config';
import { CRM_MODULE } from './crm.config';
import { ECOMMERCE_MODULE } from './ecommerce.config';
import { HR_MODULE } from './hr.config';
import { INVENTORY_MODULE } from './inventory.config';
import { MARKETING_MODULE } from './marketing.config';
import { PM_MODULE } from './pm.config';
import type { Layout16ModuleConfig } from './types';
import { USER_MODULE } from './user.config';

export const LAYOUT16_MODULES: Layout16ModuleConfig[] = [
  CALENDAR_MODULE,
  CMS_MODULE,
  USER_MODULE,
  ECOMMERCE_MODULE,
  BOOKKEEPING_MODULE,
  INVENTORY_MODULE,
  HR_MODULE,
  CRM_MODULE,
  MARKETING_MODULE,
  PM_MODULE,
];

export const getLayout16ModuleById = (id: string | undefined) => {
  return LAYOUT16_MODULES.find((m) => m.id === id);
};

export const getLayout16ModuleByPath = (pathname: string) =>
  LAYOUT16_MODULES.find(
    (m) =>
      pathname === m.rootPath ||
      (m.rootPath.length > 1 && pathname.startsWith(m.rootPath)),
  );
