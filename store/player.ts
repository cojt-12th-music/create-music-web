import { mutationTree, actionTree } from 'typed-vuex'
import { PlayerState } from '~/types/player'

export const state = (): PlayerState => ({
  context: null,
  isPlaying: false,
  isReady: false,
  loadingProgress: 0,
  instruments: [],
  melodyInstrument: '',
  chordInstrument: '',
  rythmInstrument: ''
})

export const mutations = mutationTree(state, {
  SET_CONTEXT(state: PlayerState, ctx: AudioContext) {
    state.context = ctx
  },
  SET_IS_PLAYING(state: PlayerState, isPlaying: boolean) {
    state.isPlaying = isPlaying
  },
  SET_IS_READY(state: PlayerState, isReady) {
    state.isReady = isReady
  },
  SET_LOADING_PROGRESS(state: PlayerState, progress: number) {
    state.loadingProgress = progress
  },
  SET_INSTRUMENTS(state: PlayerState, insts: string[]) {
    state.instruments = insts
  },
  SET_MELODY_INSTRUMENT(state: PlayerState, inst) {
    state.melodyInstrument = inst
  },
  SET_CHORD_INSTRUMENT(state: PlayerState, inst) {
    state.chordInstrument = inst
  },
  SET_RYTHM_INSTRUMENT(state: PlayerState, inst) {
    state.rythmInstrument = inst
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    setContext({ commit }, ctx: AudioContext) {
      commit('SET_CONTEXT', ctx)
    },
    play({ commit }) {
      commit('SET_IS_PLAYING', true)
    },
    stop({ commit }) {
      commit('SET_IS_PLAYING', false)
    },
    setIsReady({ commit }, isReady: boolean) {
      commit('SET_IS_READY', isReady)
    },
    setLoadingProgress({ commit }, progress: number) {
      commit('SET_LOADING_PROGRESS', progress)
    },
    setInstruments({ commit }, insts: string[]) {
      commit('SET_INSTRUMENTS', insts)
    },
    setMelodyInstrument({ commit }, inst: string) {
      commit('SET_MELODY_INSTRUMENT', inst)
    },
    setChordInstrument({ commit }, inst: string) {
      commit('SET_CHORD_INSTRUMENT', inst)
    },
    setRythmInstrument({ commit }, inst: string) {
      commit('SET_RYTHM_INSTRUMENT', inst)
    }
  }
)
