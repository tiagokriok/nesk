import { PLATFORM } from '../constants';

export function getDefaultStore() {
  const { IS_MAC } = PLATFORM;

  return {
    screen: {
      initial: {
        width: 240,
        height: 80,
      },
      large: {
        width: 240,
        height: 473,
      },
    },
    shortcuts: {
      moveTimer: {
        up: IS_MAC ? 'Shift+Alt+CommandOrControl+Up' : 'Shift+Alt+Up',
        down: IS_MAC ? 'Shift+Alt+CommandOrControl+Down' : 'Shift+Alt+Down',
        left: IS_MAC ? 'Shift+Alt+CommandOrControl+Left' : 'Shift+Alt+Left',
        right: IS_MAC ? 'Shift+Alt+CommandOrControl+Right' : 'Shift+Alt+Right',
      },
      openPreferences: 'CommandOrControl+,',
      controls: {
        play: 'Space',
        pause: 'Space',
        stop: 's',
        next: 'l',
      },
    },
    hasShadow: true,
  };
}
