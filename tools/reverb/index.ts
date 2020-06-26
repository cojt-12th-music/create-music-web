import path from 'path'
import consola from 'consola'
import axios from 'axios'
import fs from 'fs-extra'
import reverbsList from '../../reverbs.json'

export const main = async () => {
  async function mkdirIfNotExist(p: string) {
    if (!fs.existsSync(path.resolve(__dirname, p)))
      await fs.mkdir(path.resolve(__dirname, p))
  }

  consola.info('Preparing reverbs... ')

  await mkdirIfNotExist('../../static/reverbs')
  await Promise.all(
    reverbsList.map(async (rev) => {
      try {
        await axios.get(rev.url).then((res) => {
          fs.writeFile(`static/reverbs/${rev.name}Base64`, res.data)
        })
      } catch (e) {}
    })
  )

  fs.writeFile(
    `static/reverbs/reverbs.json`,
    JSON.stringify(reverbsList.map((rev) => `reverbs/${rev.name}Base64`))
  )

  consola.info(`Reverbs ready`)
}

main()
