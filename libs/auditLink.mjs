import wappalyzerProcesser from './wappalyzer.mjs'
import pagespeedProcesser from './pagespeed.mjs'
import lightHouseConverter from '../converters/lightHouseConverter.mjs'
import wappalyzerConverter from '../converters/wappalyzerConverter.mjs'
import webVitalsConverter from '../converters/webVitalsConverter.mjs'

export default async (url) => {
  const wappalyzerResults = await wappalyzerProcesser(url)
  const lighouseResultsDesktop = await pagespeedProcesser(url, 'desktop')
  const lighouseResultsMobile = await pagespeedProcesser(url, 'mobile')
  return {
    wappalyzer: await wappalyzerConverter(wappalyzerResults),
    webvitalsMobile: await webVitalsConverter(lighouseResultsMobile.loadingExperience),
    webvitalsDesktop: await webVitalsConverter(lighouseResultsDesktop.loadingExperience),
    lighthouseDesktop: await lightHouseConverter(lighouseResultsDesktop.lighthouseResult),
    lighthouseMobile: await lightHouseConverter(lighouseResultsMobile.lighthouseResult)
  }
}
