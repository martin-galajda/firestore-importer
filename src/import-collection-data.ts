import * as commander from 'commander'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { importData } from './firestore'
const csv = require('csvtojson/v2')

dotenv.config()

commander
  .version('0.0.1')
  .command('')
  .arguments('<path_to_file>')
  .option('-c, --collection <collection>', 'The target collection to import data into.')
  .option('-i, --id <id>', 'Optional field to use as identifier.')
  .action(async pathToFile => {
    const collection = commander.collection
    const idField = commander.id

    console.log({ pathToFile, collection, idField })

    const csvFilePath = path.resolve(__dirname, '..', 'data', pathToFile)

    csv()
      .fromFile(csvFilePath)
      .then(async (items: any[]) => {

        await importData({
          jsonArray: items,
          collection,
        })

        console.log('Successfully imported data!')
      })
  })
  .parse(process.argv)
