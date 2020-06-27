import { BlockHash, PresetHash } from '@/types/music'

export const CHORD_BLOCKS: BlockHash = {
  コード1: {
    name: 'コード1',
    sounds: [
      { id: 1, key: 48, delay: 0.0, duration: 0.5 },
      { id: 2, key: 60, delay: 0.5, duration: 0.5 },
      { id: 3, key: 64, delay: 1.5, duration: 0.5 },
      { id: 4, key: 60, delay: 2.0, duration: 0.5 }
    ],
    duration: 2,
    category: 'ええやつ'
  },
  コード2: {
    name: 'コード2',
    sounds: [
      { id: 1, key: 48, delay: 0.0, duration: 0.5 },
      { id: 2, key: 67, delay: 0.5, duration: 0.5 },
      { id: 3, key: 72, delay: 1.5, duration: 0.5 }
    ],
    duration: 2,
    category: 'ええやつ'
  },
  コード3: {
    name: 'コード3',
    sounds: [
      { id: 1, key: 48, delay: 0.0, duration: 0.5 },
      { id: 2, key: 60, delay: 0.5, duration: 0.5 },
      { id: 3, key: 72, delay: 1.0, duration: 0.5 },
      { id: 4, key: 67, delay: 1.5, duration: 0.5 }
    ],
    duration: 2,
    category: '俺は嫌い'
  },
  コード4: {
    name: 'コード4',
    sounds: [
      { id: 1, key: 48, delay: 0.5, duration: 0.5 },
      { id: 2, key: 72, delay: 1.0, duration: 0.5 },
      { id: 3, key: 48, delay: 2.0, duration: 0.5 }
    ],
    duration: 2,
    category: '俺は嫌い'
  }
}

export const CHORD_PRESETS: PresetHash = {
  王道: {
    name: '王道',
    blockNames: []
  },
  カノン: {
    name: 'カノン',
    blockNames: []
  },
  小室: {
    name: '小室',
    blockNames: []
  },
  'Let it Be': {
    name: 'Let it Be',
    blockNames: []
  },
  下降転調: {
    name: '下降転調',
    blockNames: []
  }
}
