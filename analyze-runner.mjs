import { csv2json } from 'json-2-csv'
import finalResultConverter from './converters/finalResultConverter.mjs'
import { BigQuery } from '@google-cloud/bigquery'
import auditLink from './libs/auditLink.mjs'
import fs from 'fs'
const urlsList = await csv2json(fs.readFileSync('./auditUrls.csv', 'utf8'), {
  delimiter: {
    eol: '\n'
  },
  excelBOM: true
})

for (const url of urlsList) {
  await processLink(url)
}

async function processLink (url) {
  const bigquery = new BigQuery()
  console.log('AUDIT STARTED FOR: ', url.Link)
  try {
    const auditRes = await auditLink({
      url: url.Link,
      type: url.Type,
      process: ['pagespeed-desktop', 'pagespeed-mobile']
    })
    const dataset = bigquery.dataset('dataset_jan_2024')
    const result = await finalResultConverter(auditRes, url.Domain)
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
