import { csv2json } from 'json-2-csv'
import axios from 'axios'
import fs from 'fs'

const urlsList = await csv2json(fs.readFileSync('./auditUrls.csv', 'utf8'), {
  delimiter: {
    eol: '\n'
  },
  excelBOM: true
})

for (const url of urlsList) {
  console.log(url)
  await axios.post('http://127.0.0.1:5001/thailand-web-landscape-gcp/asia-southeast1/runAnalyze', { requestDomain: url })
}
