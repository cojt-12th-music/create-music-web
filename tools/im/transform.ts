import path from 'path'
import parseSFZ from 'sfz-parser'
import fs from 'fs-extra'

export async function transform(sfzPath: string) {
  const sfzDir = path.dirname(sfzPath)
  const sfzFileName = path.basename(sfzPath, '.sfz')
  const sfzText = await fs.readFile(sfzPath, 'ascii')
  const sfz = parseSFZ(sfzText)
  const transformedSfz = await Promise.all(
    sfz.map(async (r) => {
      const newName = r.sample
        .replace(/#/g, '_sharp_')
        .replace(/\?/g, '_question_')
      await fs.rename(
        path.resolve(sfzDir, r.sample),
        path.resolve(sfzDir, newName)
      )
      r.sample = newName
      return r
    })
  )
  await fs.writeFile(
    path.resolve(sfzDir, `${sfzFileName}.jsfz`),
    JSON.stringify(transformedSfz)
  )
}
