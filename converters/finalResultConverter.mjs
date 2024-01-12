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

  if (data.builtwith) {
    convertedData.TECH_STACK = data.builtwith.map(l => {
      return {
        ...l,
        domain
      }
    })
  }

  if (data.lighthouseMobile) {
    convertedData.MOBILE_THIRD_PARTY = data.lighthouseMobile.thirdParty.map(l => {
      return {
        ...l,
        domain
      }
    })
    delete data.lighthouseMobile.thirdParty
  }
  if (data.lighthouseDesktop) {
    convertedData.DESKTOP_THIRD_PARTY = data.lighthouseDesktop.thirdParty.map(l => {
      return {
        ...l,
        domain
      }
    })
    delete data.lighthouseDesktop.thirdParty
  }

  delete data.wappalyzer
  if (data.webvitalsMobile) {
    convertedData.MOBILE_WEBVITALS = flatten(data.webvitalsMobile, { delimiter: '_' })
    if (convertedData.MOBILE_WEBVITALS) {
      convertedData.MOBILE_WEBVITALS.domain = domain
    }
  }

  if (data.webvitalsDesktop) {
    convertedData.DESKTOP_WEBVITALS = flatten(data.webvitalsDesktop, { delimiter: '_' })
    if (convertedData.DESKTOP_WEBVITALS) {
      convertedData.DESKTOP_WEBVITALS.domain = domain
    }
  }

  if (data.lighthouseMobile) {
    convertedData.MOBILE_LIGHTHOUSE = flatten(data.lighthouseMobile, { delimiter: '_' })
    convertedData.MOBILE_LIGHTHOUSE.domain = domain
  }

  if (data.lighthouseDesktop) {
    convertedData.DESKTOP_LIGHTHOUSE = flatten(data.lighthouseDesktop, { delimiter: '_' })
    convertedData.DESKTOP_LIGHTHOUSE.domain = domain
  }
  return convertedData
}
