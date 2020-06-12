export interface PlayerState {
  context: AudioContext | null
  isPlaying: boolean
  isReady: boolean
  loadingProgress: number
  instruments: string[]
  melodyInstrument: string
  chordInstrument: string
  rythmInstrument: string
}
