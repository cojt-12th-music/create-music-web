/**
 * store/preset.ts
 * 楽譜作成時のプリセットに関するstore
 */

import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { Block } from '~/types/music'

export interface BlockState {
  melody: { [label: string]: Block }
  chord: { [label: string]: Block }
  rhythm: { [label: string]: Block }
}

export const state = (): BlockState => ({
  melody: {},
  chord: {},
  rhythm: {}
})

export const getters = getterTree(state, {})

export const mutations = mutationTree(state, {})

export const actions = actionTree({ state, getters, mutations }, {})
