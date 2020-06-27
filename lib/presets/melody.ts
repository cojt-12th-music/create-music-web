import { BlockHash } from '@/types/music'

export const MELODY_BLOCKS: BlockHash = {
  メロ1: {
    name: 'メロ1',
    sounds: [
      { id: 1, key: 48, delay: 0.0, duration: 0.5 },
      { id: 2, key: 60, delay: 0.5, duration: 0.5 },
      { id: 3, key: 64, delay: 1.5, duration: 0.5 },
      { id: 4, key: 60, delay: 2.0, duration: 0.5 }
    ],
    duration: 4,
    category: '二階堂'
  },
  メロ2: {
    name: 'メロ2',
    sounds: [
      { id: 1, key: 48, delay: 0.0, duration: 0.5 },
      { id: 2, key: 67, delay: 0.5, duration: 0.5 },
      { id: 3, key: 72, delay: 1.5, duration: 0.5 }
    ],
    duration: 3,
    category: 'いいちこ'
  },
  メロ3: {
    name: 'メロ3',
    sounds: [
      { id: 1, key: 48, delay: 0.0, duration: 0.5 },
      { id: 2, key: 60, delay: 0.5, duration: 0.5 },
      { id: 3, key: 72, delay: 1.0, duration: 0.5 },
      { id: 4, key: 67, delay: 1.5, duration: 0.5 }
    ],
    duration: 4,
    category: '二階堂'
  },
  メロ4: {
    name: 'メロ4',
    sounds: [
      { id: 1, key: 48, delay: 0.5, duration: 0.5 },
      { id: 2, key: 72, delay: 1.0, duration: 0.5 },
      { id: 3, key: 48, delay: 2.0, duration: 0.5 }
    ],
    duration: 2,
    category: 'いいちこ'
  }
}
