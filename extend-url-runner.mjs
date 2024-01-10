import extendLink from './libs/extendLink.mjs'
import { csv2json } from 'json-2-csv'
import fs from 'fs'

function shuffle (array) {
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

let urlsList = csv2json(fs.readFileSync('./auditDomains.valid.csv', 'utf8'), {
  delimiter: {
    eol: '\n'
  },
  excelBOM: true
})
urlsList = [...new Set(urlsList.map((url) => url.domain))]
fs.writeFileSync('./auditUrls.csv', '')
fs.appendFileSync('./auditUrls.csv', 'Domain,Link,Type\n')
for (const url of urlsList) {
  console.log(`Extend ${url}`)
  const extendedUrl = await extendLink(url)
  fs.appendFileSync('./auditUrls.csv', `${url},http://${url},Based\n`)
  for (const link of shuffle(extendedUrl).slice(0, 15)) {
    fs.appendFileSync('./auditUrls.csv', `${url},${link},Extendedlink\n`)
  }
}
