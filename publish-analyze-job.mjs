import { csv2json } from 'json-2-csv'
import axios from 'axios'
import fs from 'fs'

const urlsList = await csv2json(fs.readFileSync('./auditUrls.csv', 'utf8'), {
  delimiter: {
    eol: '\n'
  },
  excelBOM: true
})

const sleep = ms => new Promise(r => setTimeout(r, ms))

for (const url of urlsList) {
  await sleep(300)

  console.log(url)
  axios.post('https://asia-southeast1-thailand-web-landscape-gcp.cloudfunctions.net/runAnalyze', { requestDomain: url }).catch(e => {})
}
