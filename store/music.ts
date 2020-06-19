/**
 * store/music.ts
 * ユーザが作成する楽譜に関するstore
 */

import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { Music, Block, Sound, ScoreCategory } from '@/types/music'
import {
  MELODY_BLOCKS,
  CHORD_BLOCKS,
  CHORD_PRESETS,
  RHYTHM_BLOCKS
} from '@/lib/presets'

export const state = (): Music => ({
  melody: {
    instrument: 'guitar',
    blockNames: ['メロ1', 'メロ2', 'メロ3', 'メロ4'],
    gain: 1
  },
  chord: {
    instrument: 'guitar',
    blockNames: ['王道', '王道', '小室', '小室', 'カノン', 'かノン'],
    gain: 1
  },
  rhythm: {
    instrument: 'guitar',
    blockNames: ['16ビート', '8ビート', '8ビート', '2ビート', '2ビート'],
    gain: 1
  },
  blocks: {
    // プリセットなどはとりあえず @/lib/presets.ts に定義している
    melody: MELODY_BLOCKS,
    chord: CHORD_BLOCKS,
    rhythm: RHYTHM_BLOCKS
  },
  bpm: 100
})

export type MusicState = ReturnType<typeof state>

export const getters = getterTree(state, {
  /**
   * テンプレートやプリセットの名前のみを返す系のgetters
   * 編集時に使用する
   */
  // リズム
  rhythmTemplateNames: (state: MusicState): string[] =>
    Object.keys(state.blocks.rhythm),
  // コード
  chordPresetNames: (_: MusicState): string[] => Object.keys(CHORD_PRESETS),
  // メロディー
  melodyTemplateNames: (state: MusicState): string[] =>
    Object.keys(state.blocks.melody),

  /**
   * 実際に再生する順番でblocksを返す系のgetters
   * 音源の再生時に使用する
   */
  // メロディーのblocksを返す
  melodyBlocks: (state: MusicState): Block[] =>
    state.melody.blockNames.map((name) => state.blocks.melody[name]),
  // メロディーのblocksを返す
  chordBlocks: (state: MusicState): Block[] =>
    state.chord.blockNames.map((name) => state.blocks.chord[name]),
  // メロディーのblocksを返す
  rhythmBlocks: (state: MusicState): Block[] =>
    state.rhythm.blockNames.map((name) => state.blocks.rhythm[name])
})

export const mutations = mutationTree(state, {
  /**
   * ブロックをブロックリストに追加する
   * @param block 追加するブロック
   */
  ADD_BLOCK_TO_LIST(state: MusicState, block: Block) {
    state.blocks.melody[block.name] = block
  },
  /**
   * ブロックに新しいsoundを追加する
   * @param blockName 追加するブロックの名前
   * @param sound 追加するsound
   */
  ADD_SOUND(
    state: MusicState,
    { blockName, sound }: { blockName: string; sound: Sound }
  ) {
    sound.id = state.blocks.melody[blockName].sounds.length + 1
    state.blocks.melody[blockName].sounds.push(sound)
  },
  /**
   * ブロックのsoundを変更する
   * @param blockName 変更する音が存在しているブロックの名前
   * @param sound 変更後のsound
   */
  UPDATE_SOUND(
    state: MusicState,
    { blockName, sound }: { blockName: string; sound: Sound }
  ) {
    if (sound.id) {
      state.blocks.melody[blockName].sounds.splice(sound.id - 1, 1, sound)
    }
  },
  /**
   * 楽譜のブロック配列を置き換える
   * v-modelで変更を観測したときに呼ぶ
   * @param blockNames 変更後のブロック配列
   */
  SET_BLOCK_NAMES(
    state: MusicState,
    { category, blockNames }: { category: ScoreCategory; blockNames: string[] }
  ) {
    const blocksCount = state[category].blockNames.length
    state[category].blockNames.splice(0, blocksCount, ...blockNames)
  },
  /**
   * コードのプリセットをセットする
   * @param presetName セットするプリセット名
   */
  SET_CHORD_PRESET(state: MusicState, presetName: string) {
    const preset = CHORD_PRESETS[presetName]
    const namesLength = state.chord.blockNames.length
    state.chord.blockNames.splice(0, namesLength, ...preset.blockNames)
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    /**
     * ブロックをブロックリストに追加する
     * @param block 追加するブロック
     */
    addBlockToList({ commit }, block: Block) {
      commit('ADD_BLOCK_TO_LIST', block)
    },
    /**
     * blockをディープコピーし, 新たなblockを追加する
     * hoge というblockをコピーする場合, hoge' というblockを新しく生成する
     * @param blockName コピーするブロックの名前
     */
    copyBlock({ state, commit }, blockName: string) {
      const block = JSON.parse(JSON.stringify(state.blocks.melody[blockName]))
      block.name = `${block.name}'`
      commit('ADD_BLOCK_TO_LIST', block)
    },
    /**
     * ブロックに新しいsoundを追加する
     * @param blockName soundを追加するブロックの名前
     * @param sound 追加するsound
     */
    addSound(
      { commit },
      { blockName, sound }: { blockName: string; sound: Sound }
    ) {
      commit('ADD_SOUND', { blockName, sound })
    },
    /**
     * ブロックのsoundを変更する
     * @param blockName 変更するsoundを持っているブロックの名前
     * @param sound 変更後のsound
     */
    updateSound(
      { commit },
      { blockName, sound }: { blockName: string; sound: Sound }
    ) {
      commit('UPDATE_SOUND', { blockName, sound })
    },
    /**
     * 楽譜のブロック配列を置き換える
     * v-modelで変更を観測したときに呼ぶ
     * @param blockNames 変更後のブロック配列
     */
    setBlockNames(
      { commit },
      {
        category,
        blockNames
      }: { category: ScoreCategory; blockNames: string[] }
    ) {
      commit('SET_BLOCK_NAMES', { category, blockNames })
    },
    /**
     * コードのプリセットをセットする
     * @param presetName セットするプリセット名
     */
    setChordPreset({ commit }, presetName: string) {
      commit('SET_CHORD_PRESET', presetName)
    }
  }
)
