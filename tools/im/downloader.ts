import path from 'path'
import consola from 'console'
import axios from 'axios'
import fs from 'fs-extra'
import decompress from 'decompress'
const decompressTarxz = require('decompress-tarxz')

export async function downloadAndUnzip(url: string, name: string) {
  consola.info(`Downloading ${name}`)
  const archivePath = await download(url)
  consola.info(`Decompressing ${name}`)
  const files = await unzip(archivePath, './instruments/')
  files
    .filter((f) => f.path.endsWith('.sfz'))
    .forEach((f) => {
      fs.writeFile(
        resolveFromHere(
          `./instruments/${path.dirname(f.path)}/${path.basename(
            f.path,
            '.sfz'
          )}__name.txt`
        ),
        name
      )
    })
  consola.info(`Done ${name}`)
}

async function download(url: string) {
  const basename = path.basename(url)
  if (fs.existsSync(resolveFromHere(`./archives/${basename}`)))
    return `./archives/${basename}`
  const { data } = await axios.get(url, { responseType: 'arraybuffer' })
  await fs.writeFile(resolveFromHere(`./archives/${basename}`), data)
  return `./archives/${basename}`
}

function unzip(src: string, dst: string) {
  return decompress(resolveFromHere(src), resolveFromHere(dst), {
    plugins: [decompressTarxz()]
  })
}

function resolveFromHere(p: string) {
  return path.resolve(__dirname, p)
}
