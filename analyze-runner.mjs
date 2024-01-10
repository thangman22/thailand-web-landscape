import { csv2json } from 'json-2-csv'
import finalResultConverter from './converters/finalResultConverter.mjs'
import { BigQuery } from '@google-cloud/bigquery'
import auditLink from './libs/auditLink.mjs'
import fs from 'fs'
const urls = await csv2json(fs.readFileSync('./auditUrls.csv', 'utf8'), {
  delimiter: {
    eol: '\n'
  },
  excelBOM: true
})

const urlChunks = sliceIntoChunks(urls, 10)
let processedChunks = 0

for (const urls of urlChunks) {
  processedChunks++
  console.log(`${processedChunks}/${urlChunks.length}`)
  const processPromise = []
  for (const url of urls) {
    processPromise.push(processLink(url))
  }
  await Promise.all(processPromise)
}

function sliceIntoChunks (arr, chunkSize) {
  const res = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize)
    res.push(chunk)
  }
  return res
}

async function processLink (url) {
  const bigquery = new BigQuery()
  console.log('AUDIT STARTED FOR: ', url.Link)
  const auditRes = await auditLink({
    url: url.Link,
    type: url.Type
  })
  const dataset = bigquery.dataset('dataset_jan_2024')
  const result = await finalResultConverter(auditRes, url.Domain)

  try {
    await dataset.table('DESKTOP_LIGHTHOUSE').insert(result.DESKTOP_LIGHTHOUSE)
    console.log(`${url.Link} ${url.Domain} inserted DESKTOP_LIGHTHOUSE`)
    await dataset.table('MOBILE_LIGHTHOUSE').insert(result.MOBILE_LIGHTHOUSE)
    console.log(`${url.Link} ${url.Domain} inserted MOBILE_LIGHTHOUSE`)
    console.log('--------------------------------------')
    if (result.MOBILE_WEBVITALS.domain) {
      await dataset.table('MOBILE_WEBVITALS').insert(result.MOBILE_WEBVITALS)
      console.log(`${url.Link} ${url.Domain} inserted MOBILE_WEBVITALS`)
    }
    if (result.DESKTOP_WEBVITALS.domain) {
      await dataset.table('DESKTOP_WEBVITALS').insert(result.DESKTOP_WEBVITALS)
      console.log(`${url.Link} ${url.Domain} inserted DESKTOP_WEBVITALS`)
    }
    console.log('--------------------------------------')
    result.MOBILE_THIRD_PARTY.map(async l => {
      await dataset.table('MOBILE_THIRD_PARTY').insert(l)
    })
    console.log(`${url.Link} ${url.Domain} inserted MOBILE_THIRD_PARTY`)
    result.DESKTOP_THIRD_PARTY.map(async l => {
      await dataset.table('DESKTOP_THIRD_PARTY').insert(l)
    })
    console.log(`${url.Link} ${url.Domain} inserted DESKTOP_THIRD_PARTY`)
    console.log('--------------------------------------')
    if (result.TECH_STACK.length > 0) {
      result.TECH_STACK.map(async l => {
        await dataset.table('TECH_STACK').insert(l)
      })
      console.log(`${url.Link} ${url.Domain} inserted TECH_STACK`)
    }
    console.log('--------------------------------------')
  } catch (e) {
    console.log(e)
  }
  return true
}
