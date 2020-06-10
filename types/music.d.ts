/**
 * music.d.ts
 * ユーザが作成する楽譜に関するデータ型
 * 各ブロックはblocks以下に置き, メロディ, コード, リズムそれぞれではblockの参照を持つ
 * 楽譜内における時間は, 4分音符1つ分を1とする
 */

/**
 * Sound: 音に関するデータ型
 * id: Block内における識別子. auto incrementが良さそう
 * key: 再生する音源のキー
 * delay: 音源を再生する相対時刻
 * duration: 音源を再生する相対時間
 */
export interface Sound {
  id?: number
  key: number
  delay: number
  duration: number
}

/**
 * Block: ブロックに関するデータ型. 編集画面のブロックの部分である.
 * name: ブロックのラベル (Firestoreにおける主キー)
 * sounds: ブロックの構成する音
 * duration: ブロックを再生するのにかかる時間
 */
export interface Block {
  name: string
  sounds: Sound[]
  duration: number
}

/**
 * Preset: ブロックをまとめたプリセットに関するデータ型.
 * ブロックのnameをキーとするオブジェクト
 */
interface Preset {
  [name: string]: Block
}

/**
 * Melody: 楽譜の内メロディ全体に関するデータ型
 * blockNames: メロディを構成するブロック配列
 * gain: メロディ全ての音源のゲイン (楽器の音調節用)
 */
export interface Melody {
  blockNames: string[]
  gain: number
}

// コードに関するデータ型
export interface Chord {}

// リズムに関するデータ型
export interface Rhythm {}

/**
 * Music: 楽譜全体に関するデータ型
 * bpm: 楽曲再生時のbpm
 * melody: メロディの楽譜情報
 * chord: コードの楽譜情報
 * rhythm: リズムの楽譜情報
 * blocks: melody, chord, rhytmそれぞれのブロック
 */
export interface Music {
  bpm: number
  melody: Melody
  chord: Chord
  rhythm: Rhythm
  blocks: {
    melody: Preset
    chord: Preset
    rhythm: Preset
  }
}