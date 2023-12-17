import wappalyzerProcesser from './wappalyzer.mjs'
import pagespeedProcesser from './pagespeed.mjs'
import lightHouseConverter from '../converters/lightHouseConverter.mjs'
import wappalyzerConverter from '../converters/wappalyzerConverter.mjs'
import webVitalsConverter from '../converters/webVitalsConverter.mjs'

export default async ({ url, type }) => {
  let wappalyzerResults = null
  if (type === 'Based') {
    wappalyzerResults = await wappalyzerProcesser(url)
  }

  const lighouseResultsDesktop = await pagespeedProcesser(url, 'desktop')
  const lighouseResultsMobile = await pagespeedProcesser(url, 'mobile')
  return {
    wappalyzer: wappalyzerResults ? await wappalyzerConverter(wappalyzerResults) : null,
    webvitalsMobile: lighouseResultsMobile.loadingExperience.metrics ? await webVitalsConverter(lighouseResultsMobile.loadingExperience) : null,
    webvitalsDesktop: lighouseResultsDesktop.loadingExperience.metrics ? await webVitalsConverter(lighouseResultsDesktop.loadingExperience) : null,
    lighthouseDesktop: await lightHouseConverter(lighouseResultsDesktop.lighthouseResult),
    lighthouseMobile: await lightHouseConverter(lighouseResultsMobile.lighthouseResult)
  }
}
