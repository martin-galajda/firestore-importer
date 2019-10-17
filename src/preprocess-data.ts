import * as path from 'path'
import * as fs from 'fs'
import * as parseDomain from 'parse-domain'

const PATH_TO_SOURCE_FILE = path.join(__dirname, '../data/all-urls-v1.csv')
const PATH_TO_DEST_FILE = path.join(__dirname, '../data/preprocessed-all-urls-v1.csv')

const main = () => {
  const fileData = fs.readFileSync(PATH_TO_SOURCE_FILE)
    .toString()
  
  const lines = fileData.split('\n')
  lines.splice(0, 1)

  const urlsGroupedByDomain: any = {}

  for (const line of lines) {
    const [url,] = line.split(',')

    if (!url) {
      continue
    }

    let {domain} = parseDomain(url)
    urlsGroupedByDomain[domain] = urlsGroupedByDomain[domain] || []
    urlsGroupedByDomain[domain].push(line)
  }

  const currPtrs: any = {}
  const endPtrs: any = {}
  Object
    .keys(urlsGroupedByDomain)
    .forEach(key => {
      currPtrs[key] = 0
      endPtrs[key] = urlsGroupedByDomain[key].length - 1
    })
    
    
  let doneMergingData = false

  const results: any[] = []
  while (!doneMergingData) {
    doneMergingData = true
    Object.keys(urlsGroupedByDomain)
      .forEach(domainKey => {
        if (currPtrs[domainKey] <= endPtrs[domainKey]) {
          results.push(urlsGroupedByDomain[domainKey][currPtrs[domainKey]])
          currPtrs[domainKey] += 1
          doneMergingData = false
        }
      })
  }

  fs.writeFileSync(PATH_TO_DEST_FILE, results.join('\n'))
}

main()

