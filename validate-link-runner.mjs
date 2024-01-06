import validateLink from './libs/validateLink.mjs'
import dedupDomains from './libs/dedupDomains.mjs'
import consola from 'consola'
import { json2csv, csv2json } from 'json-2-csv'
import fs from 'fs'
const validUrls = []
const notValidUrls = []
const domainList = await dedupDomains(csv2json(fs.readFileSync('./auditDomains.csv', 'utf8'), {
  delimiter: {
    eol: '\r\n'
  },
  excelBOM: true
}))

let processingList = []

const removeDomainfromProcessList = (domain) => {
  processingList = processingList.filter(element => element !== domain)
}
const runValidateLink = async (url) => {
  console.info(`Validate ${url.domain}`)
  processingList.push(url.domain)
  const domainValid = await validateLink(url.domain)
  if (!domainValid) {
    consola.info(`Add www to ${url.domain}`)
    const wwwDomainValid = await validateLink(`www.${url.domain}`)
    if (!wwwDomainValid) {
      consola.error(`${url.domain} is not valid`)
      removeDomainfromProcessList(url.domain)
      notValidUrls.push(url)
      return false
    }
    removeDomainfromProcessList(url.domain)
    url.domain = `www.${url.domain}`
  } else {
    removeDomainfromProcessList(url.domain)
  }
  validUrls.push(url)
  consola.success(`${url.domain} is Valid`)
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

for (const url of domainList) {
  runValidateLink(url)
  await sleep(1000)
}

while (processingList.length > 0) {
  console.log(`PENDING: ${processingList.length} / ${domainList.length}`)
  await sleep(1000)
}

console.log('-----------------------------------------')
const validCSV = json2csv(validUrls)
console.log(validCSV)

console.log('-----------------------------------------')
const notValidCSV = json2csv(notValidUrls)
console.log(notValidCSV)
