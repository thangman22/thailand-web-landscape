import { flatten } from 'flat'

export default async (data, domain) => {
  const convertedData = {
    MOBILE_WEBVITALS: {},
    DESKTOP_WEBVITALS: {},
    MOBILE_LIGHTHOUSE: {},
    DESKTOP_LIGHTHOUSE: {},
    MOBILE_THIRD_PARTY: {},
    DESKTOP_THIRD_PARTY: {},
    TECH_STACK: {}
  }

  convertedData.TECH_STACK = data.wappalyzer.map(l => {
    return {
      ...l,
      domain
    }
  })

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

  convertedData.MOBILE_WEBVITALS = flatten(data.webvitalsMobile)
  convertedData.MOBILE_WEBVITALS.domain = domain

  convertedData.DESKTOP_WEBVITALS = flatten(data.webvitalsDesktop)
  convertedData.DESKTOP_WEBVITALS.domain = domain

  convertedData.MOBILE_LIGHTHOUSE = flatten(data.lighthouseMobile)
  convertedData.MOBILE_LIGHTHOUSE.domain = domain

  convertedData.DESKTOP_LIGHTHOUSE = flatten(data.lighthouseDesktop)
  convertedData.DESKTOP_LIGHTHOUSE.domain = domain

  return convertedData
}
