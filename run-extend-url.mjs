import extendLink from './libs/extendLink.mjs'
import fs from 'fs'

// quick and dirty CSV parsing, keep only first column for now
function csvToUrlList(csv) {
  const rows = csv.split("\n").slice(1);  // remove header
  const result = [];

  for (const row of rows) {
    const values = row.split(",")[0];  // keep only first column
    result.push(values);
  }

  return result
}

function shuffle (array) {
  let currentIndex = array.length; let randomIndex
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]]
  }

  return array
}

const csv = fs.readFileSync('./auditDomains.csv', 'utf8')
const urls = csvToUrlList(csv)

fs.writeFileSync('./auditUrls.csv', '')
fs.appendFileSync('./auditUrls.csv', 'Domain, Link\n')
for (const url of urls) {
  console.log(`Extend ${url}`)
  const extendedUrl = await extendLink(url)
  fs.appendFileSync('./auditUrls.csv', `${url}, https://${url}\n`)
  for (const link of shuffle(extendedUrl).slice(0, 15)) {
    fs.appendFileSync('./auditUrls.csv', `${url}, ${link}\n`)
  }
}
