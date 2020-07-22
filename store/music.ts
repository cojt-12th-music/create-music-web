/**
 * store/music.ts
 * ユーザが作成する楽譜に関するstore
 */

import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { Music, Block, Sound, ScorePart } from '@/types/music'
import { MELODY_BLOCKS, CHORD_BLOCKS, RHYTHM_BLOCKS } from '@/lib/presets'
import { firestoreAccessor } from '@/plugins/firebase'

export const state = (): Music => ({
  title: '無題のタイトル',
  composer: '名無しの作曲者',
  bpm: 100,
  melody: {
    instrument: '',
    blockNames: [],
    gain: 1
  },
  chord: {
    instrument: '',
    blockNames: [],
    gain: 1
  },
  rhythm: {
    instrument: '',
    blockNames: [],
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
   * テンプレートのブロック配列を返す系のgetters
   * 編集時に使用する
   */
  // メロディー
  melodyTemplates: (state: MusicState): Block[] =>
    Object.values(state.blocks.melody),
  // コード
  chordTemplates: (state: MusicState): Block[] =>
    Object.values(state.blocks.chord),
  // リズム
  rhythmTemplates: (state: MusicState): Block[] =>
    Object.values(state.blocks.rhythm),
  // 以上を関数化したもの
  partTemplates: (state: MusicState): ((part: ScorePart) => Block[]) => (
    part: ScorePart
  ) => Object.values(state.blocks[part]),

  /**
   * 実際に再生する順番でblocksを返す系のgetters
   * 音源の再生時に使用する
   */
  // メロディー
  melodyBlocks: (state: MusicState): Block[] =>
    state.melody.blockNames.map((name) => state.blocks.melody[name]),
  // コード
  chordBlocks: (state: MusicState): Block[] =>
    state.chord.blockNames.map((name) => state.blocks.chord[name]),
  // リズム
  rhythmBlocks: (state: MusicState): Block[] =>
    state.rhythm.blockNames.map((name) => state.blocks.rhythm[name]),
  // 以上を関数化したもの
  partBlocks: (state: MusicState): ((part: ScorePart) => Block[]) => (
    part: ScorePart
  ) => state[part].blockNames.map((name) => state.blocks[part][name]),

  /**
   * 各パートの楽器名を返す系のgetters
   */
  // メロディー
  melodyInstrument: (state: MusicState): string => state.melody.instrument,
  // コード
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
   * ブロックを変更する
   * @param part 変更するブロックのパート
   * @param block 変更するブロック
   */
  UPDATE_BLOCK(
    state: MusicState,
    { part, block }: { part: ScorePart; block: Block }
  ) {
    Object.assign(state.blocks[part], { [block.name]: block })
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
    sound.id = (sounds[sounds.length - 1]?.id || 0) + 1
    sounds.push(sound)
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
   * @param part 更新するブロックのパート
   * @param blockName 更新するブロックの名前
   */
  REFRESH_BLOCK_DURATION(
    state: MusicState,
    { part, blockName }: { part: ScorePart; blockName: string }
  ) {
    const blockHash = state.blocks[part]
    if (blockHash[blockName].sounds.length) {
      // 音が存在する場合はdurationの最大値をセット
      blockHash[blockName].duration = blockHash[blockName].sounds.reduce(
        (d: number, sound: Sound) => Math.max(sound.delay + sound.duration, d),
        0
      )
    } else {
      // 音が存在しない場合は4をセット
      blockHash[blockName].duration = 4
    }
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
     * 初期ブロックを作成する
     * @param part ブロックのパート
     * @param blockName ブロックの名前
     */
    initBlock({ state, commit }, part: ScorePart): Block {
      const block: Block = {
        name: '無題',
        category: 'マイブロック',
        sounds: new Array<Sound>(0),
        duration: 0,
        isOriginal: true
      }
      // もしhoge'が存在しているならhoge''を見る, これを存在しないところまで繰り返す
      while (state.blocks[part][block.name]) {
        block.name = `${block.name}'`
      }
      commit('ADD_BLOCK_TO_LIST', { part, block })
      commit('CLONE_BLOCK', { part, blockName: block.name })

      return block
    },
    /**
     * ブロックを変更する
     * @param block 変更するブロック
     */
    updateBlock(
      { commit },
      { part, block }: { part: ScorePart; block: Block }
    ) {
      commit('UPDATE_BLOCK', { part, block })
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
      const block: Block = JSON.parse(
        JSON.stringify(state.blocks[part][blockName])
      )
      // もしhoge'が存在しているならhoge''を見る, これを存在しないところまで繰り返す
      while (state.blocks[part][block.name]) {
        block.name = `${block.name}'`
      }
      block.category = 'マイブロック'
      block.isOriginal = true
      // コピー後のブロックをリストに追加する
      commit('ADD_BLOCK_TO_LIST', { part, block })

      // コピー前のブロック名をコピー後のものに置き換える
      const blockNames = state[part].blockNames.map((name: string) =>
        name === blockName ? block.name : name
      )
      commit('SET_BLOCK_NAMES', { part, blockNames })
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
      commit('REFRESH_BLOCK_DURATION', { part, blockName })
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
      commit('REFRESH_BLOCK_DURATION', { part, blockName })
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
      commit('REFRESH_BLOCK_DURATION', { part, blockName })
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
