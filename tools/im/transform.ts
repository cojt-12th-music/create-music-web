import path from 'path'
import parseSFZ from 'sfz-parser'
import fs from 'fs-extra'
import wav from 'wav'
import lamejs from 'lamejs'

export async function transform(sfzPath: string) {
  const sfzDir = path.dirname(sfzPath)
  const sfzFileName = path.basename(sfzPath, '.sfz')
  const sfzText = await fs.readFile(sfzPath, 'ascii')
  const sfz = parseSFZ(sfzText)
  const samples: { [key: string]: string } = {}
  const transformedSfz = await Promise.all(
    sfz.map(async (r) => {
      const newName = r.sample
        .replace(/#/g, '_sharp_')
        .replace(/\?/g, '_question_')
        .replace(/\.wav$/, '')
      samples[newName] = await wavToMp3Base64(path.resolve(sfzDir, r.sample))
      r.sample = newName
      return r
    })
  )
  await fs.writeFile(
    path.resolve(sfzDir, `${sfzFileName}.jsfz`),
    JSON.stringify({
      sfz: transformedSfz,
      samples
    })
  )
}

function wavToMp3Base64(w: string): Promise<string> {
  return new Promise<string>((resolve) => {
    const ins = fs.createReadStream(w)
    const reader = new wav.Reader()
    reader.on('format', (fmt) => {
      const encoder = new lamejs.Mp3Encoder(fmt.channels, fmt.sampleRate, 192)
      let base64res = ''
      reader.on('data', (chunk) => {
        const bytes = new Uint8Array(chunk)
        const arr = new Int16Array(bytes.buffer)
        let mp3buf
        if (fmt.channels === 2) {
          const left = arr.filter((_, i) => i % 2 === 0)
          const right = arr.filter((_, i) => i % 2 === 1)
          mp3buf = encoder.encodeBuffer(left, right)
        } else {
          mp3buf = encoder.encodeBuffer(arr)
        }
        base64res += Buffer.from(mp3buf).toString('base64')
      })
      reader.on('end', () => resolve(base64res))
    })
    ins.pipe(reader)
  })
}
