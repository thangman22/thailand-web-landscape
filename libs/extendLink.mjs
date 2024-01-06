import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
export default async (url) => {
  let links = []
  puppeteer.use(StealthPlugin())
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: 'new',
    executablePath: process.env.CHROMIUM_BIN
  })
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(60000)
  try {
    await page.goto(`http://${url}`, {
      waitUntil: 'domcontentloaded'
    })
  } catch (error) {
    console.error(error)
  }

  try {
    const hrefs = await page.$$eval('a', as => as.map(a => a.href))
    links = [...new Set(hrefs.filter(h => h.includes(url) && !['facebook.com', 'line.me'].includes(h)))]
  } catch (error) {

  }

  await browser.close()
  return links
}
