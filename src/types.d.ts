interface IImportDataOptions {
  jsonArray: any[]
  collection: string
  idField?: string
}

interface IImportDatasetOptions {
  jsonArray: any[]
  datasetName: string
}

interface ICleanCollectionDataOptions {
  collection: string
}
