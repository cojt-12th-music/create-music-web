/**
 * store/preset.ts
 * 楽譜作成時のプリセットに関するstore
 */

import { getterTree, mutationTree, actionTree } from 'typed-vuex';
import { Music } from '~/types/music';

export const state = (): Music => ({
  melody: {
    blocks: [{ label: 'init', sounds: [] }],
  },
  chord: {},
  rhythm: {},
});

export type State = ReturnType<typeof state>;

export const getters = getterTree(state, {});

export const mutations = mutationTree(state, {});

export const actions = actionTree({ state, getters, mutations }, {});
