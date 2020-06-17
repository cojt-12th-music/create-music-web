import path from 'path'
import fs from 'fs-extra'
import consola from 'consola'
import axios from 'axios'
import instrumentsList from '../../instruments.json'
import reverbsList from '../../reverbs.json'
import { downloadAndUnzip } from './downloader'
import { transform } from './transform'

export async function main() {
  function dir(d: string, ext: string): string[] {
    return fs
      .readdirSync(d)
      .map((l) => path.join(d, l))
      .map((l) => (fs.statSync(l).isDirectory() ? dir(l, ext) : [l]))
      .flat()
      .filter((f) => f.endsWith(ext))
      .map((p) => p.replace(/^static/, '').replace(/\\/g, '/'))
  }

  async function mkdirIfNotExist(p: string) {
    if (!fs.existsSync(path.resolve(__dirname, p)))
      await fs.mkdir(path.resolve(__dirname, p))
  }

  consola.info('Preparing instruments... ')
  if (process.env.force_instruments_reset) {
    await fs.remove(path.resolve(__dirname, './archives'))
    await fs.remove(path.resolve(__dirname, './instruments'))
  }

  await mkdirIfNotExist('./archives')
  fs.remove(path.resolve(__dirname, './instruments'))
  await mkdirIfNotExist('./instruments')
  await Promise.all(
    instrumentsList.map(async (inst) => {
      await downloadAndUnzip(inst.url, inst.name)
    })
  )

  consola.info('Transforming data...')
  const sfzs = dir(path.resolve(__dirname, './instruments'), '.sfz')
  await Promise.all(
    sfzs.map(async (sfz) => {
      consola.info(`Transforming ${sfz}`)
      await transform(sfz)
    })
  )

  const jsfzs = dir(
    path.resolve(__dirname, './instruments'),
    '.jsfz'
  ).map((p) => path.relative(__dirname, p).replace(/\\/g, '/'))

  await fs.writeFile(
    path.resolve(__dirname, './instruments/instruments.json'),
    JSON.stringify(jsfzs)
  )

  fs.copy(
    path.resolve(__dirname, './instruments'),
    path.resolve(__dirname, '../../static/instruments/'),
    {
      filter: (src) => /(^(?!.*\.).*$|\.(json|jsfz)$)/.test(src)
    }
  )
  consola.info(`Instruments ready`)

  consola.info('Preparing reverbs... ')

  await mkdirIfNotExist('../../static/reverbs')
  await Promise.all(
    reverbsList.map(async (rev) => {
      await axios.get(rev.url).then((res) => {
        fs.writeFile(`static/reverbs/${rev.name}Base64`, res.data)
      })
    })
  )

  fs.writeFile(
    `static/reverbs/reverbs.json`,
    JSON.stringify(reverbsList.map((rev) => `reverbs/${rev.name}Base64`))
  )

  consola.info(`Reverbs ready`)
}
