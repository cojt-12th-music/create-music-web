/**
 * store/player.ts
 * アプリ上の音源再生に関するstore
 */
import Vue from 'vue'
import { mutationTree, actionTree } from 'typed-vuex'
import { PlayerState, Instrument } from '~/types/player'
import { ScorePart } from '~/types/music'

export const state = (): PlayerState => ({
  userId: '',
  context: null,
  isPlaying: false,
  isReady: false,
  isMute: {
    melody: false,
    chord: false,
    rhythm: false
  },
  editEnabled: false,
  playTime: 0,
  loadingProgress: 0,
  instruments: [],
  previewPreset: {
    part: null,
    name: null
  },
  previewUnitSound: {
    part: null,
    key: 0
  },
  reverbs: []
})

export const mutations = mutationTree(state, {
  SET_USER_ID(state: PlayerState, userId: string) {
    state.userId = userId
  },
  SET_CONTEXT(state: PlayerState, ctx: AudioContext) {
    state.context = ctx
  },
  SET_IS_PLAYING(state: PlayerState, isPlaying: boolean) {
    state.isPlaying = isPlaying
  },
  SET_IS_READY(state: PlayerState, isReady: boolean) {
    state.isReady = isReady
  },
  SET_LOADING_PROGRESS(state: PlayerState, progress: number) {
    state.loadingProgress = progress
  },
  SET_INSTRUMENTS(state: PlayerState, insts: Instrument[]) {
    state.instruments = insts
  },
  SET_EDIT_ENABLED(state: PlayerState, enabled: boolean) {
    state.editEnabled = enabled
  },
  SET_PREVIEW_PRESET(
    state: PlayerState,
    previewPreset: { part: ScorePart | null; name: string | null }
  ) {
    Vue.set(state, 'previewPreset', previewPreset)
  },
  SET_PREVIEW_UNITSOUND(
    state: PlayerState,
    previewUnitSound: { part: ScorePart | null; key: number | 0 }
  ) {
    Vue.set(state, 'previewUnitSound', previewUnitSound)
  },
  SET_PLAYTIME(state: PlayerState, playtime: number) {
    state.playTime = playtime
  },
  SET_REVERBS(state: PlayerState, rvs: string[]) {
    state.reverbs = rvs
  },
  SET_MUTE(
    state: PlayerState,
    { part, isMute }: { part: ScorePart; isMute: boolean }
  ) {
    Vue.set(state.isMute, part, isMute)
  },
  UPDATE_KEY_RANGE(
    state: PlayerState,
    e: { hiKey: number; loKey: number; path: string }
  ) {
    const target = state.instruments.find((i) => i.path === e.path)
    if (target) {
      target.hiKey = e.hiKey
      target.loKey = e.loKey
    }
  }
})

export const actions = actionTree(
  { state, mutations },
  {
    setUserId({ commit }, userId: string) {
      commit('SET_USER_ID', userId)
    },
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
    playUnitSoundPreview({ commit }, p: { part: ScorePart; key: number }) {
      commit('SET_PREVIEW_UNITSOUND', p)
    },
    stopUnitSoundPreview({ commit }) {
      commit('SET_PREVIEW_UNITSOUND', { part: null, key: 0 })
    },
    setPlayTime({ commit }, playtime: number) {
      commit('SET_PLAYTIME', playtime)
    },
    setReverbs({ commit }, rvs: string[]) {
      commit('SET_REVERBS', rvs)
    },
    setMute(
      { commit },
      { part, isMute }: { part: ScorePart; isMute: boolean }
    ) {
      commit('SET_MUTE', { part, isMute })
    },
    setEditEnabled({ commit }, enabled: boolean) {
      commit('SET_EDIT_ENABLED', enabled)
    },
    updateKeyRange(
      { commit },
      e: { hiKey: number; loKey: number; path: string }
    ) {
      commit('UPDATE_KEY_RANGE', e)
    }
  }
)
