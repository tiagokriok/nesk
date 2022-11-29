<script setup lang="ts">
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  PowerIcon,
  StopIcon,
} from '@heroicons/vue/20/solid';
import { onMounted, reactive } from 'vue';
import bellAudio from './assets/sounds/bell.wav';

const CYCLES = {
  REST: 300,
  FULL_REST: 900,
  WORK: 1500,
};

const timer = reactive({
  minutes: '',
  seconds: '',
});

const state = reactive({
  cycles: [] as Array<string>,
  currentCycle: CYCLES.WORK,
  currentNameCycle: 'WORK',
  invokedWorkCycles: 0,
  currentTimer: 0,
  isActive: false,
});

const preferences = reactive({
  isOpen: false,
});

const formatTimer = (value: number): string => String(value).padStart(2, '0');

const toMinutes = (value: number) => Math.floor(value / 60);
const toSeconds = (value: number) => value % 60;

const setTimer = (value: number) => {
  timer.minutes = formatTimer(toMinutes(value));
  timer.seconds = formatTimer(toSeconds(value));
};

const setNextCycle = () => {
  state.isActive = false;
  const totalWorkCycles = state.cycles.filter((c) => c === 'WORK').length;
  if (totalWorkCycles >= 4 && state.currentNameCycle !== 'FULL_REST') {
    console.info('Next Cycle - FULL_REST');
    state.currentNameCycle = 'FULL_REST';
    state.currentCycle = CYCLES.FULL_REST;
    state.cycles.push('FULL_REST');
  } else if (state.currentNameCycle === 'FULL_REST') {
    console.info('Next Cycle - WORK');
    state.currentNameCycle = 'WORK';
    state.currentCycle = CYCLES.WORK;
    state.cycles = ['WORK'];
  } else if (
    state.currentNameCycle === 'REST' ||
    state.cycles.at(-1) === 'REST'
  ) {
    console.info('Next Cycle - WORK');
    state.currentCycle = CYCLES.WORK;
    state.currentNameCycle = 'WORK';
    state.cycles.push('WORK');
  } else {
    console.info('Next Cycle - REST');
    state.currentCycle = CYCLES.REST;
    state.currentNameCycle = 'REST';
    state.cycles.push('REST');
  }
  state.currentTimer = state.currentCycle;
  setTimer(state.currentCycle);
};

const bell = () => {
  new Audio(bellAudio).play();
};

onMounted(() => {
  state.cycles.push(state.currentNameCycle);
  setTimer(state.currentCycle);
});

let timerInterval: NodeJS.Timer;

const handlerTimer = () =>
  (timerInterval = setInterval(() => {
    state.currentTimer--;

    setTimer(state.currentTimer);

    if (state.currentTimer === 0) {
      clearInterval(timerInterval);
      // TODO Play Sound
      bell();
      setNextCycle();
    }
  }, 1000));

const handlerPlay = () => {
  console.info('PLAY');
  state.currentTimer = state.currentCycle;
  setTimer(state.currentTimer);
  state.isActive = true;
  handlerTimer();
};

const handlerStop = () => {
  console.info('STOP');
  clearInterval(timerInterval);
  state.currentTimer = CYCLES[state.cycles.at(-1) as keyof typeof CYCLES];
  state.currentCycle = state.currentTimer;
  state.isActive = false;
  console.log(state.currentCycle);
  setTimer(state.currentCycle);
};

const handlerPause = () => {
  console.info('PAUSE');
  if (state.isActive) {
    clearInterval(timerInterval);
    state.isActive = false;
    state.currentCycle = state.currentTimer;
  }
  setTimer(state.currentCycle);
};

const handlerNextCycle = () => {
  console.info('NEXT');
  handlerPause();
  setNextCycle();
};

const handlerSettings = () => {
  console.log('SETTINGS');
  window.nesk.settings(!preferences.isOpen);
  preferences.isOpen = !preferences.isOpen;
};

const handlerClose = () => {
  console.log('CLOSE');
  window.nesk.close();
};

const handlerRedirect = (url: string) => {
  console.log('REDIRECT');
  window.nesk.redirect(url);
};

// const handlerMouseEnter = () => {
//   console.log('Enter');
//   ipcRenderer.send('set-ignore-mouse-events', false);
// };

// const handlerMouseLeave = () => {
//   console.log('Leave', process.platform);
//   if (process.platform === 'win32') {
//     ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
//   } else {
//     ipcRenderer.send('set-ignore-mouse-events', true);
//   }
// };
</script>

<template>
  <div
    class="mx-auto bg-[#0E121B] rounded-xl shadow-md shadow-[#00D9F6] px-4 max-w-[230px] w-60 max-h-[473px] border-[#00D9F6] border container-timer relative cursor-move flex flex-col items-stretch overflow-hidden space-y-6"
    :class="{
      'h-48 justify-start py-4': preferences.isOpen,
      'h-10 justify-center py-8': !preferences.isOpen,
    }"
  >
    <div class="flex items-center justify-between">
      <div class="flex flex-row items-center space-x-4 text-[#00D9F6]">
        <button
          v-if="state.isActive"
          type="button"
          @click="handlerPause"
          class="focus:outline-none"
        >
          <PauseIcon class="h-5 w-5 hover:text-[#6C7589]" />
        </button>
        <button
          v-else
          type="button"
          @click="handlerPlay"
          class="focus:outline-none"
        >
          <PlayIcon class="h-5 w-5 hover:text-[#6C7589]" />
        </button>
        <button type="button" @click="handlerStop" class="focus:outline-none">
          <StopIcon class="h-5 w-5 hover:text-[#6C7589]" />
        </button>
        <button
          type="button"
          @click="handlerNextCycle"
          class="focus:outline-none"
        >
          <ForwardIcon class="h-5 w-5 hover:text-[#6C7589]" />
        </button>
      </div>
      <div class="text-3xl text-[#00D9F6] action-button">
        <div>{{ timer.minutes }}:{{ timer.seconds }}</div>
      </div>
    </div>
    <div v-if="preferences.isOpen">
      <div
        class="flex flex-col items-center text-sm font-mono font-bold space-y-2"
      >
        <div
          class="bg-[#F5AF18] px-4 py-2 rounded-md w-40 flex items-center justify-center"
        >
          <button
            @click="handlerRedirect('https://www.buymeacoffee.com/tiagokriok')"
            type="button"
            class="w-full flex justify-center"
          >
            <span>Buy me a coffe</span>
          </button>
        </div>
        <div
          class="bg-[#F53818] px-4 py-2 rounded-md w-40 flex items-center justify-center"
        >
          <button
            @click="handlerClose"
            type="button"
            class="flex items-center justify-center text-white space-x-2 w-full"
          >
            <span>Quit</span>
            <PowerIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
    <div class="absolute -bottom-1 left-2/4">
      <button
        type="button"
        @click="handlerSettings"
        class="text-[#00D9F6] hover:rounded-full hover:bg-[#00D9F6] hover:text-[#0E121B] focus:outline-none"
      >
        <ChevronUpIcon v-if="preferences.isOpen" class="h-4 w-4" />
        <ChevronDownIcon v-else class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<style>
.container-timer {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
button,
a {
  -webkit-app-region: no-drag;
}
::-webkit-scrollbar {
  display: none;
}
</style>
