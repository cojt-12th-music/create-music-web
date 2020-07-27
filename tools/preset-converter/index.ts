import path from 'path'
import fs from 'fs-extra'
import { ScorePart, BlockHash } from '../../types/music'
import { parseMIDI } from './parser'

const listPartMidi = async (part: ScorePart) => {
  const res: { [key: string]: string[] } = {}
  const categories = (
    await fs.readdir(path.resolve('lib/presets/midi', part))
  ).filter((f) =>
    fs.statSync(path.resolve('lib/presets/midi', part, f)).isDirectory()
  )
  await Promise.all(
    categories.map(async (c) => {
      res[c] = await (
        await fs.readdir(path.resolve('lib/presets/midi', part, c))
      ).filter((p) => p.endsWith('.mid'))
    })
  )
  return res
}

const convert = async (part: ScorePart) => {
  const cats = await listPartMidi(part)
  const res: BlockHash = {}
  await Promise.all(
    Object.keys(cats).map(async (c) => {
      await Promise.all(
        cats[c].map(async (p) => {
          const tmp = await parseMIDI(part, c, p)
          res[tmp.name] = tmp
        })
      )
    })
  )
  return res
}

const main = async () => {
  fs.writeFile('lib/presets/chord.json', JSON.stringify(await convert('chord')))

  fs.writeFile(
    'lib/presets/rhythm.json',
    JSON.stringify(await convert('rhythm'))
  )

  fs.writeFile(
    'lib/presets/melody.json',
    JSON.stringify(await convert('melody'))
  )
}
main()
