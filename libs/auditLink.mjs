import wappalyzerProcesser from './wappalyzer.mjs'
import pagespeedProcesser from './pagespeed.mjs'
import lightHouseConverter from '../converters/lightHouseConverter.mjs'
import wappalyzerConverter from '../converters/wappalyzerConverter.mjs'
import webVitalsConverter from '../converters/webVitalsConverter.mjs'

export default async ({ url, type }) => {
  let lighouseResultsDesktop = null
  let lighouseResultsMobile = null
  let wappalyzerResults = null
  if (type === 'Based') {
    console.log('Wappalyzer started')
    wappalyzerResults = await wappalyzerProcesser(url)
  }
  console.log('Page Speed started')
  try {
    lighouseResultsDesktop = await pagespeedProcesser(url, 'desktop')
  } catch (error) {

  }

  try {
    lighouseResultsMobile = await pagespeedProcesser(url, 'mobile')
  } catch (error) {

  }

  return {
    wappalyzer: wappalyzerResults ? await wappalyzerConverter(wappalyzerResults) : null,
    webvitalsMobile: lighouseResultsMobile?.loadingExperience?.metrics ? await webVitalsConverter(lighouseResultsMobile.loadingExperience) : null,
    webvitalsDesktop: lighouseResultsDesktop?.loadingExperience?.metrics ? await webVitalsConverter(lighouseResultsDesktop.loadingExperience) : null,
    lighthouseDesktop: lighouseResultsDesktop ? await lightHouseConverter(lighouseResultsDesktop?.lighthouseResult) : null,
    lighthouseMobile: lighouseResultsDesktop ? await lightHouseConverter(lighouseResultsMobile?.lighthouseResult) : null
  }
}
