import { mutationTree, actionTree } from 'typed-vuex'
import { PlayerState } from '~/types/player'

export const state = (): PlayerState => ({
  context: null,
  isPlaying: false,
  isReady: false,
  loadingProgress: 0,
  instruments: [],
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
  SET_INSTRUMENTS(state: PlayerState, insts: string[]) {
    state.instruments = insts
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
    setInstruments({ commit }, insts: string[]) {
      commit('SET_INSTRUMENTS', insts)
    },
    setReverbs({ commit }, rvs: string[]) {
      commit('SET_REVERBS', rvs)
    }
  }
)
