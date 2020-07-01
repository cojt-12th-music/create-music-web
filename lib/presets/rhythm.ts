import { BlockHash } from '@/types/music'

export const RHYTHM_BLOCKS: BlockHash = {
  '2ビート': {
    name: '2ビート',
    sounds: [],
    duration: 2,
    category: '歌のお兄さん系'
  },
  '8ビート': {
    name: '8ビート',
    sounds: [],
    duration: 2,
    category: '歌のお兄さん系'
  },
  '16ビート': {
    name: '16ビート',
    sounds: [
      {
        id: 0,
        key: 48,
        delay: 0,
        duration: 0.5
      },
      {
        id: 0,
        key: 48,
        delay: 2,
        duration: 0.5
      },
      {
        id: 0,
        key: 51,
        delay: 1,
        duration: 0.5
      },
      {
        id: 0,
        key: 51,
        delay: 3,
        duration: 0.5
      },
      {
        id: 0,
        key: 57,
        delay: 0,
        duration: 0.5
      },
      {
        id: 0,
        key: 57,
        delay: 0.5,
        duration: 0.5
      },
      {
        id: 0,
        key: 57,
        delay: 1,
        duration: 0.5
      },
      {
        id: 0,
        key: 57,
        delay: 1.5,
        duration: 0.5
      },
      {
        id: 0,
        key: 57,
        delay: 2,
        duration: 0.5
      },
      {
        id: 0,
        key: 57,
        delay: 2.5,
        duration: 0.5
      },
      {
        id: 0,
        key: 57,
        delay: 3,
        duration: 0.5
      },
      {
        id: 0,
        key: 57,
        delay: 3.5,
        duration: 0.5
      }
    ],
    duration: 2,
    category: 'わくわくさん系'
  }
}
