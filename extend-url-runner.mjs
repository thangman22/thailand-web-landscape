import dedupDomains from './libs/dedupDomains.mjs'
import extendLink from './libs/extendLink.mjs'
import csv from 'csvtojson'
import fs from 'fs'

function shuffle(array) {
  let currentIndex = array.length
  let randomIndex
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ]
  }

  return array
}

// auditDomains.csv structure:
// domain, category_code, date_added, notes
const converter = csv({
  checkColumn: true,
  delimiter: ',',
  includeColumns: /(domain|category_code|date_added|notes)/,
  trim: true,
})
const domainList = await dedupDomains(await converter.fromFile('./auditDomains.csv'))
console.log(`Unique domains: ${domainList.length}`)

fs.writeFileSync('./auditUrls.csv', '')
fs.appendFileSync('./auditUrls.csv', 'Domain, Link, Type\n')
for (const domain of domainList) {
  console.log(`Extend ${domain.domain}`)
  const extendedUrl = await extendLink(domain.domain)
  fs.appendFileSync('./auditUrls.csv', `${domain.domain}, https://${domain.domain}, Based\n`)
  for (const link of shuffle(extendedUrl).slice(0, 15)) {
    fs.appendFileSync('./auditUrls.csv', `${domain.domain}, ${link}, Extendedlink\n`)
  }
}
