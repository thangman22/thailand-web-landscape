import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

export default async (url) => {
  let links = []
  puppeteer.use(StealthPlugin())
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.CHROMIUM_BIN
  })
  const page = await browser.newPage()

  try {
    await page.setDefaultNavigationTimeout(15000)
    await page.goto(`https://${url}`)
  } catch (error) {
    console.log(error)
  }

  try {
    const hrefs = await page.$$eval('a', as => as.map(a => a.href))
    console.log(hrefs)
    links = [...new Set(hrefs.filter(h => h.includes(url)))]
  } catch (error) {
    console.log(error)
  }

  await browser.close()
  return links
}
