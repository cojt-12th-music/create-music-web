import { BlockHash } from '@/types/music'

export const RHYTHM_BLOCKS: BlockHash = {
  '2ビート': {
    name: '2ビート',
    sounds: [
      { id: 1, key: 48, delay: 0.0, duration: 0.5 },
      { id: 2, key: 48, delay: 0.5, duration: 0.5 },
      { id: 3, key: 53, delay: 1.0, duration: 0.5 },
      { id: 4, key: 53, delay: 1.5, duration: 0.5 }
    ],
    duration: 2,
    category: '歌のお兄さん系'
  },
  '8ビート': {
    name: '8ビート',
    sounds: [
      { id: 1, key: 54, delay: 0.0, duration: 0.5 },
      { id: 2, key: 65, delay: 0.5, duration: 0.5 },
      { id: 3, key: 54, delay: 1.0, duration: 0.5 },
      { id: 4, key: 65, delay: 1.5, duration: 0.5 }
    ],
    duration: 2,
    category: '歌のお兄さん系'
  },
  '16ビート': {
    name: '16ビート',
    sounds: [
      {
        id: 1,
        key: 48,
        delay: 0,
        duration: 0.5
      },
      {
        id: 2,
        key: 48,
        delay: 2,
        duration: 0.5
      },
      {
        id: 3,
        key: 51,
        delay: 1,
        duration: 0.5
      },
      {
        id: 4,
        key: 51,
        delay: 3,
        duration: 0.5
      },
      {
        id: 5,
        key: 57,
        delay: 0,
        duration: 0.5
      },
      {
        id: 6,
        key: 57,
        delay: 0.5,
        duration: 0.5
      },
      {
        id: 7,
        key: 57,
        delay: 1,
        duration: 0.5
      },
      {
        id: 8,
        key: 57,
        delay: 1.5,
        duration: 0.5
      },
      {
        id: 9,
        key: 57,
        delay: 2,
        duration: 0.5
      },
      {
        id: 10,
        key: 57,
        delay: 2.5,
        duration: 0.5
      },
      {
        id: 11,
        key: 57,
        delay: 3,
        duration: 0.5
      },
      {
        id: 12,
        key: 57,
        delay: 3.5,
        duration: 0.5
      }
    ],
    duration: 2,
    category: 'わくわくさん系'
  }
}
