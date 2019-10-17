import * as commander from 'commander'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { importDataset } from './firestore'

const uuidv4 = require('uuid/v4')

const csv = require('csvtojson/v2')

dotenv.config()

commander
  .version('0.0.1')
  .arguments('<path_to_file>')
  .option('-d, --datasetname <datasetname>', 'The name of the dataset to import.')
  .action(async pathToFile => {
    const datasetName = commander.datasetname
    const csvFilePath = path.resolve(__dirname, '..', 'data', pathToFile)

    csv()
      .fromFile(csvFilePath)
      .then(async (items: any[]) => {

        await importDataset({
          jsonArray: items.map((item, idx) => ({
            position: idx,
            uuid: uuidv4(),
            ...item,
          })),
          datasetName,
        })

        console.log('Successfully imported data!')
      })
  })
  .parse(process.argv)
