import { flatten } from 'flat'

export default async (data, domain) => {
  const convertedData = {
    MOBILE_WEBVITALS: {},
    DESKTOP_WEBVITALS: {},
    MOBILE_LIGHTHOUSE: {},
    DESKTOP_LIGHTHOUSE: {},
    MOBILE_THIRD_PARTY: [],
    DESKTOP_THIRD_PARTY: [],
    TECH_STACK: []
  }

  if (data.wappalyzer) {
    convertedData.TECH_STACK = data.wappalyzer.map(l => {
      return {
        ...l,
        domain
      }
    })
  }

  convertedData.MOBILE_THIRD_PARTY = data.lighthouseMobile.thirdParty.map(l => {
    return {
      ...l,
      domain
    }
  })

  convertedData.DESKTOP_THIRD_PARTY = data.lighthouseDesktop.thirdParty.map(l => {
    return {
      ...l,
      domain
    }
  })
  delete data.lighthouseDesktop.thirdParty
  delete data.lighthouseMobile.thirdParty
  delete data.wappalyzer

  convertedData.MOBILE_WEBVITALS = data.webvitalsMobile ? flatten(data.webvitalsMobile, { delimiter: '_' }) : null
  if (convertedData.MOBILE_WEBVITALS) {
    convertedData.MOBILE_WEBVITALS.domain = domain
  }

  convertedData.DESKTOP_WEBVITALS = data.webvitalsDesktop ? flatten(data.webvitalsDesktop, { delimiter: '_' }) : null
  if (convertedData.DESKTOP_WEBVITALS) {
    convertedData.DESKTOP_WEBVITALS.domain = domain
  }

  convertedData.MOBILE_LIGHTHOUSE = flatten(data.lighthouseMobile, { delimiter: '_' })
  convertedData.MOBILE_LIGHTHOUSE.domain = domain

  convertedData.DESKTOP_LIGHTHOUSE = flatten(data.lighthouseDesktop, { delimiter: '_' })
  convertedData.DESKTOP_LIGHTHOUSE.domain = domain

  return convertedData
}
