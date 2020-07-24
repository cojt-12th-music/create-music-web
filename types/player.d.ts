import { ScorePart } from './music'

export interface PlayerState {
  context: AudioContext | null
  isPlaying: boolean
  isReady: boolean
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
  maxLength: number
}

export interface Instrument {
  name: string
  path: string
}
