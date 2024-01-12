import Wappalyzer from 'wappalyzer'

export default async (url) => {
  const options = {
    debug: false,
    delay: 500,
    headers: {},
    maxDepth: 3,
    maxUrls: 10,
    maxWait: 30000,
    recursive: true,
    probe: true,
    proxy: false,
    userAgent: 'Wappalyzer',
    htmlMaxCols: 2000,
    htmlMaxRows: 2000,
    noScripts: false,
    noRedirect: false
  }
  try {
    const wappalyzer = new Wappalyzer(options)
    await wappalyzer.init()
    const site = await wappalyzer.open(url)
    const results = await site.analyze()
    await wappalyzer.destroy()
    return results
  } catch (error) {
    console.log(JSON.stringify(error))
    return false
  }
}
