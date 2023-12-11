import csv from 'csvtojson';
import auditLink from "./libs/auditLink.mjs";
import fs from 'fs';

const urls = await csv().fromFile('./auditUrls.csv')

for (const url of urls){
    console.log(url)
    console.log(await auditLink(url['Link']))
}