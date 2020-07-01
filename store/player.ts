import { mutationTree, actionTree } from 'typed-vuex'
import { PlayerState, Instrument } from '~/types/player'
import { ScorePart } from '~/types/music'

export const state = (): PlayerState => ({
  context: null,
  isPlaying: false,
  isReady: false,
  loadingProgress: 0,
  instruments: [],
  previewPreset: {
    part: null,
    name: null
  },
  reverbs: []
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
  SET_INSTRUMENTS(state: PlayerState, insts: Instrument[]) {
    state.instruments = insts
  },
  SET_PREVIEW_PRESET(
    state: PlayerState,
    previewPreset: { part: ScorePart | null; name: string | null }
  ) {
    state.previewPreset = { ...previewPreset }
  },
  SET_REVERBS(state: PlayerState, rvs: string[]) {
    state.reverbs = rvs
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
    setInstruments({ commit }, insts: Instrument[]) {
      commit('SET_INSTRUMENTS', insts)
    },
    playPresetPreview({ commit }, p: { part: ScorePart; name: string }) {
      commit('SET_PREVIEW_PRESET', p)
    },
    stopPresetPreview({ commit }) {
      commit('SET_PREVIEW_PRESET', { part: null, name: null })
    },
    setReverbs({ commit }, rvs: string[]) {
      commit('SET_REVERBS', rvs)
    }
  }
)
