## Utility for importing dataset of URLS into Firestore

# Purpose:
Import collected URLs for annotation into Firestore, so we can annotate them using the Chrome extension.

# How to import data to Firestore

1. Install node, npm, make
2. Place generated firebase config with API key inside `.secrets/firebase-config.json`
3. Run `npm install`
4. Run `make run-import-dataset-to-firestore`
