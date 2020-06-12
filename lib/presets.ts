import { Preset } from '@/types/music'

export const MELODY_PRESETS: Preset = {
  init: { name: 'init', sounds: [], duration: 1 },
  メロ1: {
    name: 'メロ1',
    sounds: [
      { id: 1, key: 48, delay: 0.1, duration: 0.1 },
      { id: 2, key: 60, delay: 0.2, duration: 0.1 },
      { id: 3, key: 64, delay: 0.3, duration: 0.1 },
      { id: 4, key: 60, delay: 0.4, duration: 0.1 }
    ],
    duration: 1
  },
  メロ2: {
    name: 'メロ2',
    sounds: [
      { id: 1, key: 48, delay: 0.1, duration: 0.1 },
      { id: 2, key: 67, delay: 0.2, duration: 0.1 },
      { id: 3, key: 72, delay: 0.3, duration: 0.1 }
    ],
    duration: 1
  },
  メロ3: {
    name: 'メロ3',
    sounds: [
      { id: 1, key: 48, delay: 0.1, duration: 0.1 },
      { id: 2, key: 60, delay: 0.2, duration: 0.1 },
      { id: 3, key: 72, delay: 0.3, duration: 0.1 },
      { id: 4, key: 67, delay: 0.4, duration: 0.1 }
    ],
    duration: 1
  },
  メロ4: {
    name: 'メロ4',
    sounds: [
      { id: 1, key: 48, delay: 0.1, duration: 0.1 },
      { id: 2, key: 72, delay: 0.2, duration: 0.1 },
      { id: 3, key: 48, delay: 0.3, duration: 0.1 }
    ],
    duration: 1
  }
}

export const CHORD_PRESETS: Preset = {}

export const RHYTHM_PRESETS: Preset = {}
