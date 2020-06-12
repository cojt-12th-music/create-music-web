import path from 'path'
import parseSFZ from 'sfz-parser'
import fs from 'fs-extra'
import wav from 'wav'
const lamejs = require('lamejs')
const int24 = require('int24')

export async function transform(sfzPath: string) {
  const sfzDir = path.dirname(sfzPath)
  const sfzFileName = path.basename(sfzPath, '.sfz')
  const sfzText = await fs.readFile(sfzPath, 'ascii')
  const sfz = parseSFZ(sfzText)
  const samples: { [key: string]: { data: string; offset: number } } = {}
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

function wavToMp3Base64(w: string): Promise<{ data: string; offset: number }> {
  return new Promise<{ data: string; offset: number }>((resolve) => {
    const ins = fs.createReadStream(w)
    const reader = new wav.Reader()
    reader.on('format', (fmt) => {
      const encoder = new lamejs.Mp3Encoder(fmt.channels, fmt.sampleRate, 192)
      let all = Buffer.from([])
      reader.on('data', (chunk) => {
        all = Buffer.concat([all, chunk])
      })
      reader.on('end', () => {
        const bytes = new Uint8Array(all)
        let arr: Int16Array
        if (fmt.bitDepth === 16) arr = new Int16Array(bytes.buffer)
        else if (fmt.bitDepth === 24) {
          arr = new Int16Array(Math.floor(bytes.length / 3))
          for (let i = 0; i < bytes.length / 3; i++) {
            const b = bytes.subarray(i * 3, i * 3 + 3)
            arr[i] = Math.floor((int24.readInt24LE(b, 0) / 2 ** 24) * 2 ** 16)
          }
        } else {
          throw new Error(`depth ${fmt.bitDepth} is not supported.`)
        }
        let offset = 0
        for (let i = 0; i < arr.length; i += fmt.channels) {
          if (arr[i] !== 0) {
            offset = i / fmt.channels / fmt.sampleRate
            break
          }
        }
        let mp3buf: Int8Array
        if (fmt.channels === 2) {
          const left = arr.filter((_, i) => i % 2 === 0)
          const right = arr.filter((_, i) => i % 2 === 1)
          mp3buf = encoder.encodeBuffer(left, right)
        } else {
          mp3buf = encoder.encodeBuffer(arr)
        }

        resolve({
          data: Buffer.from(mp3buf).toString('base64'),
          offset
        })
      })
    })
    ins.pipe(reader)
  })
}
