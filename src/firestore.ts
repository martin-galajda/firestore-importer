import * as firebase from 'firebase'

const firebaseConfig = require('../.secrets/firebase-config.json')
const camelCaseObjectKeys = require('camelcase-keys')
const camelcase = require('camelcase')

firebase.initializeApp(firebaseConfig)

const BATCH_SIZE = 400

export const importData = async (options: IImportDataOptions) => {
  const  { jsonArray, collection, idField } = options
  const db = firebase.firestore()
  let batch = db.batch()
  let preparedBatchSize = 0


  for (const item of jsonArray) {
    const formattedItem = camelCaseObjectKeys(item, { deep: true })

    let itemId
    if (idField) {
      itemId = String(formattedItem[camelcase(idField)])
    }

    // Create a ref to new item
    let newItemRef
    if (itemId) {
      newItemRef = db.collection(collection)
        .doc(itemId)
    } else {
      newItemRef = db.collection(collection)
        .doc()
    }

    // Add it in the batch
    batch.set(newItemRef, formattedItem)
  
    preparedBatchSize++

    if (preparedBatchSize % BATCH_SIZE === 0) {
      await batch.commit()
      batch = db.batch()
      preparedBatchSize = 0
    }
  }

  if (preparedBatchSize) {
    await batch.commit()
  }

  // force disconnect
  process.exit(0)
}

export const documentExists = async (collectionName: string, docName: string) => {
  const db = firebase.firestore()

  const newDatasetDocRef = db
    .collection(collectionName)
    .doc(docName)

  const doc = await newDatasetDocRef.get()

  return doc.exists
}

export const importDataset = async (options: IImportDatasetOptions) => {
  const  { jsonArray, datasetName } = options
  const db = firebase.firestore()
  let batch = db.batch()
  let preparedBatchSize = 0

  if (await documentExists('datasets', datasetName)) {
    throw new Error('Dataset with that name already exists!')
  }
  if (await documentExists('workSessions', datasetName)) {
    throw new Error('Work session with that name already exists!')
  }

  const timestampFromNow = (new Date()).toISOString()
  
  const newDatasetDocRef = db
    .collection('datasets')
    .doc(datasetName)

  batch.set(newDatasetDocRef, {
    name: datasetName,
    createdAt: timestampFromNow,
    urlsCount: jsonArray.length,
  })
  preparedBatchSize += 1

  const newWorkSessionDocRef = db
    .collection('workSessions')
    .doc(datasetName)
  batch.set(newWorkSessionDocRef, {
    state: { processedUrlsListCurrIdx: 0 },
    datasetName,
    createdAt: timestampFromNow,
    updatedAt: timestampFromNow,
  })
  preparedBatchSize += 1

  for (const item of jsonArray) {
    const formattedItem = camelCaseObjectKeys(item, { deep: true })

    const newItemRef = newDatasetDocRef
      .collection('urls')
      .doc()

    // Add it in the batch
    batch.set(newItemRef, formattedItem)
  
    preparedBatchSize++

    if (preparedBatchSize % BATCH_SIZE === 0) {
      await batch.commit()
      batch = db.batch()
      preparedBatchSize = 0
    }
  }

  if (preparedBatchSize) {
    await batch.commit()
  }

  // force disconnect
  process.exit(0)
}
