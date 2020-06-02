/**
 * store/music.ts
 * ユーザが作成する楽譜に関するstore
 */

import { getterTree, mutationTree, actionTree } from 'typed-vuex';
import { Music, Melody, Sound } from '~/types/music';

export const state = (): Music => ({
  melody: {
    blocks: [{ label: 'init', sounds: [] }],
  },
  chord: {},
  rhythm: {},
});

export type State = ReturnType<typeof state>;

export const getters = getterTree(state, {
  melody: (state: State): Melody => state.melody,
  // メロディーの音を一連で流したい時
  melodySounds: (state: State): Sound[] => state.melody.blocks.map((block) => block.sounds).flat(),
});

export const mutations = mutationTree(state, {
  pushSoundToMelody(state: State, sound: Sound, blockIndex = 0) {
    state.melody.blocks[blockIndex].sounds.push(sound);
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    pushSound({ commit }, sound: Sound) {
      commit('pushSoundToMelody', sound);
    },
  }
);
