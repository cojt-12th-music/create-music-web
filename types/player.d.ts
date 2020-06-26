import { ScorePart } from './music'

export interface PlayerState {
  context: AudioContext | null
  isPlaying: boolean
  isReady: boolean
  loadingProgress: number
  instruments: string[]
  previewPreset: {
    part: ScorePart | null
    name: string | null
  }
}
