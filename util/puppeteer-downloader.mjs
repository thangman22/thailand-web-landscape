import { PUPPETEER_REVISIONS } from 'puppeteer-core'
import { install } from '@puppeteer/browsers'
import config from '../.puppeteerrc.mjs'

const buildId = PUPPETEER_REVISIONS.chrome
const cacheDir = config.cacheDirectory

async function downloadChrome (platform) {
  console.log('Installing Chrome version', buildId, 'for platform', platform, 'to', cacheDir)
  try {
    await install({ platform, browser: 'chrome', buildId, cacheDir })
    console.log('Chrome installed successfully')
  } catch (err) {
    console.error('Chrome installation failed', err)
    throw err
  }
}

(async () => {
  await downloadChrome('linux')
})().catch(() => process.exit(1))
