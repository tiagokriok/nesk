import Store from 'electron-store';

import { getDefaultStore } from './default';
import { userPreferencesSchema } from './schema';

export { getDefaultStore };

export const userPreferences = new Store({
  defaults: getDefaultStore(),
  clearInvalidConfig: true,
  schema: userPreferencesSchema,
});
