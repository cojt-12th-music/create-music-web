import { getAccessorType } from 'typed-vuex';

// サブモジュールのインポート
import * as music from '~/store/music';

export const state = () => ({});
export const getters = {};
export const mutations = {};
export const actions = {};

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: {
    music
  }
})
