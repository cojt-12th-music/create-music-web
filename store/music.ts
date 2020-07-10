/**
 * store/music.ts
 * ユーザが作成する楽譜に関するstore
 */

import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { Music, Block, Sound, ScorePart, BlockHash } from '@/types/music'
import {
  MELODY_BLOCKS,
  CHORD_BLOCKS,
  CHORD_PRESETS,
  RHYTHM_BLOCKS
} from '@/lib/presets'
import { firestoreAccessor } from '@/plugins/firebase'

export const state = (): Music => ({
  title: '無題のタイトル',
  composer: '名無しの作曲者',
  bpm: 100,
  melody: {
    instrument: '',
    blockNames: ['メロ1', 'メロ2', 'メロ3', 'メロ4'],
    gain: 1
  },
  chord: {
    instrument: '',
    blockNames: ['コード1', 'コード2', 'コード3', 'コード4'],
    gain: 1
  },
  rhythm: {
    instrument: '',
    blockNames: ['16ビート', '8ビート', '8ビート', '2ビート', '2ビート'],
    gain: 1
  },
  blocks: {
    // プリセットなどはとりあえず @/lib/presets.ts に定義している
    melody: MELODY_BLOCKS,
    chord: CHORD_BLOCKS,
    rhythm: RHYTHM_BLOCKS
  }
})

export type MusicState = ReturnType<typeof state>

export const getters = getterTree(state, {
  /**
   * テンプレートやプリセットの名前のみを返す系のgetters
   * 編集時に使用する
   */
  // リズム
  rhythmTemplates: (state: MusicState): Block[] =>
    Object.values(state.blocks.rhythm),
  // コード
  chordTemplates: (state: MusicState): Block[] =>
    Object.values(state.blocks.chord),
  // メロディー
  melodyTemplates: (state: MusicState): Block[] =>
    Object.values(state.blocks.melody),

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
    state.rhythm.blockNames.map((name) => state.blocks.rhythm[name]),

  melodyInstrument: (state: MusicState): string => state.melody.instrument,
  chordInstrument: (state: MusicState): string => state.chord.instrument,
  rhythmInstrument: (state: MusicState): string => state.rhythm.instrument
})

export const mutations = mutationTree(state, {
  /**
   * blockをメロディにクローンする
   * @param blockName ブロックの名前
   * @param index 追加する場所
   */
  CLONE_BLOCK(
    state: MusicState,
    { part, blockName }: { part: ScorePart; blockName: string }
  ) {
    state[part].blockNames.push(blockName)
  },
  /**
   * ブロックをブロックリストに追加する
   * @param block 追加するブロック
   */
  ADD_BLOCK_TO_LIST(
    state: MusicState,
    { part, block }: { part: ScorePart; block: Block }
  ) {
    state.blocks[part][block.name] = block
  },
  /**
   * ブロックに新しいsoundを追加する
   * @param blockName 追加するブロックの名前
   * @param sound 追加するsound
   */
  ADD_SOUND(
    state: MusicState,
    {
      part,
      blockName,
      sound
    }: { part: ScorePart; blockName: string; sound: Sound }
  ) {
    const sounds = state.blocks[part][blockName].sounds
    const newID = sounds.length > 0 ? sounds[sounds.length - 1].id!! + 1 : 1
    if (!sound.id) sound.id = newID
    state.blocks[part][blockName].sounds.push(sound)
  },
  /**
   * ブロックのsoundを削除する
   * @param blockName 削除するブロックの名前
   * @param soundId 削除するsoundのId
   */
  DELETE_SOUND(
    state: MusicState,
    {
      part,
      blockName,
      soundId
    }: { part: ScorePart; blockName: string; soundId: number }
  ) {
    const i = state.blocks[part][blockName].sounds.findIndex(
      (e) => e.id === soundId
    )
    state.blocks[part][blockName].sounds.splice(i, 1)
  },
  /**
   * ブロックのsoundを変更する
   * @param blockName 変更する音が存在しているブロックの名前
   * @param sound 変更後のsound
   */
  UPDATE_SOUND(
    state: MusicState,
    {
      part,
      blockName,
      sound
    }: { part: ScorePart; blockName: string; sound: Sound }
  ) {
    if (sound.id) {
      const i = state.blocks[part][blockName].sounds.findIndex(
        (e) => e.id === sound.id
      )
      state.blocks[part][blockName].sounds.splice(i, 1, sound)
    }
  },
  /**
   * 指定したブロックのdurationを更新する
   */
  UPDATE_BLOCK_DURATION(
    state: MusicState,
    payload: { part: ScorePart; blockName: string }
  ) {
    const { part, blockName } = payload
    let lastSound: Sound | null = null
    let targetBlockHash: BlockHash = {}
    switch (part) {
      case 'melody':
        if (state.blocks.melody[blockName].sounds.length === 0) lastSound = null
        else
          lastSound = state.blocks.melody[blockName].sounds.reduce((p, c) =>
            p.delay + p.duration < c.delay + c.duration ? c : p
          )
        targetBlockHash = state.blocks.melody
        break
      case 'chord':
        if (state.blocks.chord[blockName].sounds.length === 0) lastSound = null
        else
          lastSound = state.blocks.chord[blockName].sounds.reduce((p, c) =>
            p.delay + p.duration < c.delay + c.duration ? c : p
          )
        targetBlockHash = state.blocks.chord
        break
      case 'rhythm':
        if (state.blocks.melody[blockName].sounds.length === 0) lastSound = null
        else
          lastSound = state.blocks.rhythm[blockName].sounds.reduce((p, c) =>
            p.delay + p.duration < c.delay + c.duration ? c : p
          )
        targetBlockHash = state.blocks.rhythm
    }
    if (!lastSound) targetBlockHash[blockName].duration = 4
    else
      targetBlockHash[blockName].duration =
        Math.ceil((lastSound.delay + lastSound.duration) / 4) * 4
  },
  /**
   * 楽譜のブロック配列を置き換える
   * v-modelで変更を観測したときに呼ぶ
   * @param blockNames 変更後のブロック配列
   */
  SET_BLOCK_NAMES(
    state: MusicState,
    { part, blockNames }: { part: ScorePart; blockNames: string[] }
  ) {
    const blocksCount = state[part].blockNames.length
    state[part].blockNames.splice(0, blocksCount, ...blockNames)
  },
  /**
   * コードのプリセットをセットする
   * @param presetName セットするプリセット名
   */
  SET_CHORD_PRESET(state: MusicState, presetName: string) {
    const preset = CHORD_PRESETS[presetName]
    const namesLength = state.chord.blockNames.length
    state.chord.blockNames.splice(0, namesLength, ...preset.blockNames)
  },
  /**
   * リズムの音量を変更する
   * @param rhythmGain セットするゲインの値
   */
  SET_RHYTHM_GAIN(state: MusicState, rhythmGain: number) {
    state.rhythm.gain = rhythmGain
  },
  /**
   * コードの音量を変更する
   * @param chordGain セットするゲインの値
   */
  SET_CHORD_GAIN(state: MusicState, chordGain: number) {
    state.chord.gain = chordGain
  },
  /**
   * メロディの音量を変更する
   * @param melodyGain セットするゲインの値
   */
  SET_MELODY_GAIN(state: MusicState, melodyGain: number) {
    state.melody.gain = melodyGain
  },
  /**
   * BPMを変更する
   * @param bpm セットするBPMの値
   */
  SET_BPM(state: MusicState, bpm: number) {
    state.bpm = bpm
  },
  /**
   * リズムの楽器を変更する
   * @param rhythmInst セットする楽器名
   */
  SET_RHYTHM_INSTRUMENT(state: MusicState, rhythmInst: string) {
    state.rhythm.instrument = rhythmInst
  },
  /**
   * コードの楽器を変更する
   * @param chordInst セットする楽器名
   */
  SET_CHORD_INSTRUMENT(state: MusicState, chordInst: string) {
    state.chord.instrument = chordInst
  },
  /**
   * メロディの楽器を変更する
   * @param melodyInst セットする楽器名
   */
  SET_MELODY_INSTRUMENT(state: MusicState, melodyInst: string) {
    state.melody.instrument = melodyInst
  },
  SET_TITLE(state: MusicState, input: string) {
    state.title = input
  },
  SET_COMPOSER(state: MusicState, input: string) {
    state.composer = input
  },
  /**
   * 楽譜データをFirestoreからfetchしてstateにセットする
   * @param presetName セットするプリセット名
   */
  SET_SCORE(state: MusicState, data: Music) {
    Object.assign(state, data)
    console.log(state)
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    /**
     * blockをメロディにクローンする
     * @param blockName ブロックの名前
     * @param index 追加する場所
     */
    cloneBlock(
      { commit },
      { part, blockName }: { part: ScorePart; blockName: string }
    ) {
      commit('CLONE_BLOCK', { part, blockName })
    },
    /**
     * ブロックをブロックリストに追加する
     * @param block 追加するブロック
     */
    addBlockToList(
      { commit },
      { part, block }: { part: ScorePart; block: Block }
    ) {
      commit('ADD_BLOCK_TO_LIST', { part, block })
    },
    /**
     * blockをディープコピーし, 新たなblockを追加する
     * hoge というblockをコピーする場合, hoge' というblockを新しく生成する
     * @param blockName コピーするブロックの名前
     */
    copyBlock(
      { state, commit },
      { part, blockName }: { part: ScorePart; blockName: string }
    ) {
      const block = JSON.parse(JSON.stringify(state.blocks[part][blockName]))
      block.name = `${block.name}'`
      block.category = 'マイブロック'
      commit('ADD_BLOCK_TO_LIST', { part, block })
    },
    /**
     * ブロックに新しいsoundを追加する
     * @param blockName soundを追加するブロックの名前
     * @param sound 追加するsound
     */
    addSound(
      { commit },
      {
        part,
        blockName,
        sound
      }: { part: ScorePart; blockName: string; sound: Sound }
    ) {
      commit('ADD_SOUND', { part, blockName, sound })
      commit('UPDATE_BLOCK_DURATION', { part, blockName })
    },
    /**
     * ブロックのsoundを削除する
     * @param blockName 削除するブロックの名前
     * @param soundId 削除するsoundのId
     */
    deleteSound(
      { commit },
      {
        part,
        blockName,
        soundId
      }: { part: ScorePart; blockName: string; soundId: number }
    ) {
      commit('DELETE_SOUND', { part, blockName, soundId })
      commit('UPDATE_BLOCK_DURATION', { part, blockName })
    },
    /**
     * ブロックのsoundを変更する
     * @param blockName 変更するsoundを持っているブロックの名前
     * @param sound 変更後のsound
     */
    updateSound(
      { commit },
      {
        part,
        blockName,
        sound
      }: { part: ScorePart; blockName: string; sound: Sound }
    ) {
      commit('UPDATE_SOUND', { part, blockName, sound })
      commit('UPDATE_BLOCK_DURATION', { part, blockName })
    },
    /**
     * 楽譜のブロック配列を置き換える
     * v-modelで変更を観測したときに呼ぶ
     * @param blockNames 変更後のブロック配列
     */
    setBlockNames(
      { commit },
      { part, blockNames }: { part: ScorePart; blockNames: string[] }
    ) {
      commit('SET_BLOCK_NAMES', { part, blockNames })
    },
    /**
     * コードのプリセットをセットする
     * @param presetName セットするプリセット名
     */
    setChordPreset({ commit }, presetName: string) {
      commit('SET_CHORD_PRESET', presetName)
    },
    /**
     * リズムの音量を変更する
     * @param rhythmGain セットするゲインの値
     */
    setRhythmGain({ commit }, rhythmGain: number) {
      commit('SET_RHYTHM_GAIN', rhythmGain)
    },
    /**
     * コードの音量を変更する
     * @param chordGain セットするゲインの値
     */
    setChordGain({ commit }, chordGain: number) {
      commit('SET_CHORD_GAIN', chordGain)
    },
    /**
     * メロディの音量を変更する
     * @param melodyGain セットするゲインの値
     */
    setMelodyGain({ commit }, melodyGain: number) {
      commit('SET_MELODY_GAIN', melodyGain)
    },
    /**
     * BPMを変更する
     * @param bpm セットするBPMの値
     */
    setBpm({ commit }, bpm: number) {
      commit('SET_BPM', bpm)
    },
    /**
     * リズムの楽器を変更する
     * @param rhythmInst セットする楽器名
     */
    setRhythmInstrument({ commit }, rhythmInst: string) {
      commit('SET_RHYTHM_INSTRUMENT', rhythmInst)
    },
    /**
     * コードの楽器を変更する
     * @param chordInst セットする楽器名
     */
    setChordInstrument({ commit }, chordInst: string) {
      commit('SET_CHORD_INSTRUMENT', chordInst)
    },
    /**
     * メロディの楽器を変更する
     * @param melodyInst セットする楽器名
     */
    setMelodyInstrument({ commit }, MelodyInst: string) {
      commit('SET_MELODY_INSTRUMENT', MelodyInst)
    },
    setTitle({ commit }, Input: string) {
      commit('SET_TITLE', Input)
    },
    setComposer({ commit }, Input: string) {
      commit('SET_COMPOSER', Input)
    },
    /**
     * コードのプリセットをセットする
     * @param presetName セットするプリセット名
     */
    addScore({ commit, state }) {
      const data = { ...state }
      // blocksはデカいのでとりあえず全て除外
      // TODO: 初期のプリセットのみ除外するように
      data.blocks = {
        rhythm: {},
        chord: {},
        melody: {}
      }

      firestoreAccessor.scores
        .create(data)
        .then((score) => commit('SET_SCORE', score))
    }
  }
)
