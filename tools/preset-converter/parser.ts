import path from 'path'
import { Midi } from '@tonejs/midi'
import fs from 'fs-extra'
import { ScorePart, Block } from '../../types/music'

const MIDI_TIMEBASE = 480 // 決め打ち

export async function parseMIDI(
  part: ScorePart,
  category: string,
  name: string
): Promise<Block> {
  const midiData = await fs.readFile(
    path.resolve('lib/presets/midi', part, category, name)
  )
  const midi = new Midi(midiData)
  const sounds = midi.tracks[0].notes.map((n, i) => ({
    id: i,
    key: n.midi,
    delay: n.ticks / MIDI_TIMEBASE,
    duration: n.durationTicks / MIDI_TIMEBASE
  }))

  const lastSound = sounds.reduce((p, c) =>
    p.delay + p.duration < c.delay + c.duration ? c : p
  )

  return {
    name: name.substr(0, name.length - 4),
    category,
    sounds,
    duration: Math.ceil((lastSound.delay + lastSound.duration) / 4) * 4
  }
}
