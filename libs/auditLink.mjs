import wappalyzerProcesser from './wappalyzer.mjs'
import builtwithProcesser from './builtwith.mjs'
import pagespeedProcesser from './pagespeed.mjs'
import lightHouseConverter from '../converters/lightHouseConverter.mjs'
import wappalyzerConverter from '../converters/wappalyzerConverter.mjs'
import webVitalsConverter from '../converters/webVitalsConverter.mjs'
import builtwithConverter from '../converters/builtwithConverter.mjs'

export default async ({ url, type, process }) => {
  let lighouseResultsDesktop = null
  let lighouseResultsMobile = null
  let wappalyzerResults = null
  let builtwithResults = null
  if (type === 'Based' && process.includes('builtwith')) {
    console.log('Builtwith started')
    builtwithResults = await builtwithProcesser(url)
  }

  if (type === 'Based' && process.includes('wappalyzer')) {
    console.log('Wappalyzer started')
    wappalyzerResults = await wappalyzerProcesser(url)
  }

  if (process.includes('pagespeed-desktop')) {
    try {
      lighouseResultsDesktop = await pagespeedProcesser(url, 'desktop')
    } catch (error) {
    }
  }

  if (process.includes('pagespeed-mobile')) {
    try {
      lighouseResultsMobile = await pagespeedProcesser(url, 'mobile')
    } catch (error) {
    }
  }
  return {
    builtwith: builtwithResults ? await builtwithConverter(builtwithResults) : null,
    wappalyzer: wappalyzerResults ? await wappalyzerConverter(wappalyzerResults) : null,
    webvitalsMobile: lighouseResultsMobile?.loadingExperience?.metrics ? await webVitalsConverter(lighouseResultsMobile.loadingExperience) : null,
    webvitalsDesktop: lighouseResultsDesktop?.loadingExperience?.metrics ? await webVitalsConverter(lighouseResultsDesktop.loadingExperience) : null,
    lighthouseDesktop: lighouseResultsDesktop ? await lightHouseConverter(lighouseResultsDesktop?.lighthouseResult) : null,
    lighthouseMobile: lighouseResultsDesktop ? await lightHouseConverter(lighouseResultsMobile?.lighthouseResult) : null
  }
}
