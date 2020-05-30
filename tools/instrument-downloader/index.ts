import path from 'path'
import fs from 'fs-extra'
import { Plugin, Compiler } from 'webpack'
import axios from 'axios'
import decompress from 'decompress'
import consola from 'consola'
import list from '../../instruments.json'
const decompressTarxz = require('decompress-tarxz')
let i = 0
export class InstrumentDownloader implements Plugin {
  apply(compiler: Compiler) {
    compiler.hooks.beforeCompile.tapPromise(
      'InstrumentDownloader',
      async () => {
        if (i > 0) return
        i++
        try {
          await this.main()
        } catch (e) {
          consola.error(e)
        }
      }
    )
  }

  async main() {
    if (!this.exist('instruments')) await this.mkdir('instruments')
    if (!this.exist('sounds')) await this.mkdir('sounds')
    consola.info('Preparering instruments...')
    const alreadyList = await this.readInstrumentsJson()
    if (list.length !== alreadyList.length)
      await Promise.all(
        list.map(async (inst) => {
          if (!this.exist(`./instruments/${path.basename(inst.url)}`)) {
            consola.info(`Downloading ${inst.name}`)
            await this.download(inst.url)
            consola.info(`Download complete ${inst.name}`)
          }
          consola.info(`decompressing... ${inst.name}`)
          await this.unzip(`./instruments/${path.basename(inst.url)}`)
          consola.info(`Ready ${inst.name}`)
        })
      )
    const sfzs = this.dir(this.resolve('./sounds')).map((s) =>
      path.relative(__dirname, s).replace(/\\/g, '/')
    )
    await fs.writeFile(
      this.resolve('./sounds/instruments.json'),
      JSON.stringify(sfzs)
    )
    await fs.remove(this.resolve('../../static/sounds'))
    await this.copy('./sounds', '../../static/sounds')
    consola.info('Ready instruments')
  }

  async download(url: string) {
    const { data } = await axios.get(url, { responseType: 'arraybuffer' })
    await this.writeFile(`./instruments/${path.basename(url)}`, data)
  }

  unzip(filePath: string) {
    return decompress(this.resolve(filePath), this.resolve('./sounds'), {
      plugins: [decompressTarxz()]
    })
  }

  copy(src: string, dst: string) {
    return fs.copy(this.resolve(src), this.resolve(dst))
  }

  mkdir(dst: string) {
    return fs.mkdir(this.resolve(dst))
  }

  exist(path: string) {
    return fs.existsSync(this.resolve(path))
  }

  resolve(p: string) {
    return path.resolve(__dirname, p)
  }

  writeFile(dst: string, data: Buffer) {
    return fs.writeFile(this.resolve(dst), data)
  }

  dir(d: string): string[] {
    return fs
      .readdirSync(d)
      .map((l) => path.join(d, l))
      .map((l) => (fs.statSync(l).isDirectory() ? this.dir(l) : [l]))
      .flat()
      .filter((f) => f.endsWith('sfz'))
      .map((p) => p.replace(/^static/, '').replace(/\\/g, '/'))
  }

  async readInstrumentsJson(): Promise<string[]> {
    if (!this.exist('./sounds/instruments.json')) return []
    const tmp = await fs.readFile(
      this.resolve('./sounds/instruments.json'),
      'utf-8'
    )
    return JSON.parse(tmp)
  }
}
