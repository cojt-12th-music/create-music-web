import { ScorePart } from './music'

export interface PlayerState {
  userId: string
  context: AudioContext | null
  isPlaying: boolean
  isReady: boolean
  isMute: {
    [part in ScorePart]: boolean
  }
  editEnabled: boolean
  playTime: number
  loadingProgress: number
  instruments: Instrument[]
  previewPreset: {
    part: ScorePart | null
    name: string | null
  }
  previewUnitSound: {
    part: ScorePart | null
    key: number | 0
  }
  reverbs: string[]
  highlightedBlockIndex: {
    [part in ScorePart]: number
  }
}

export interface Instrument {
  name: string
  path: string
  hiKey: number
  loKey: number
}
