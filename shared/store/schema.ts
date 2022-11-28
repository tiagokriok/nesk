import { Schema } from 'electron-store';

import { getDefaultStore } from './default';

const defaultStore = getDefaultStore();

export const userPreferencesSchema: Schema<typeof defaultStore> = {
  screen: {
    type: 'object',
    properties: {
      inital: {
        type: 'object',
        properties: {
          width: {
            type: 'number',
          },
          height: {
            type: 'number',
          },
        },
      },
      large: {
        type: 'object',
        properties: {
          width: {
            type: 'number',
          },
          height: {
            type: 'number',
          },
        },
      },
    },
  },
  shortcuts: {
    type: 'object',
    properties: {
      moveTimer: {
        type: 'object',
        properties: {
          up: {
            type: 'string',
          },
          down: {
            type: 'string',
          },
          left: {
            type: 'string',
          },
          right: {
            type: 'string',
          },
        },
      },
      openPreferences: {
        type: 'string',
      },
      controls: {
        type: 'object',
        properties: {
          play: {
            type: 'string',
          },
          pause: {
            type: 'string',
          },
          stop: {
            type: 'string',
          },
          next: {
            type: 'string',
          },
        },
      },
    },
  },
  hasShadow: {
    type: 'boolean',
  },
};
