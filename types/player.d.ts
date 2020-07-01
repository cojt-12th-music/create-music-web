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
  reverbs: string[]
}

export interface Instrument {
  name: string
  path: string
}
