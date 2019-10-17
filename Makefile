SHELL := bash
export PATH := node_modules/.bin/:$(PATH)

## Variables ##
srcpath = ./src
dstpath = dist

## Rules ##

node_modules: package.json
	npm install && touch node_modules

install: node_modules .env

compile: install
	tsc --outDir $(dstpath) --project ./tsconfig.json 

run-cli: compile
	ts-node --transpile-only $(srcpath)/import-collection-data.ts --collection=$(collection) --id=$(id) $(path_to_file)

run-preprocess-data: 
	ts-node --transpile-only $(srcpath)/preprocess-data.ts 

run-import-dataset-to-firestore: compile
	ts-node --transpile-only $(srcpath)/import-dataset.ts --datasetname=output-2019-07-10T09:43:16-export-top-5000 output-2019-07-10T09:43:16-export-top-5000.csv

lint:
	tslint --project tsconfig.json --project --fix -r ./tslint.json

lint-error:
	tslint --project tsconfig.json --project

clean:
	find $(srcpath) -name '*.js' -delete -o -name '*.js.map' -delete

clean-all:
	$(MAKE) clean > /dev/null
	find . -name "node_modules" -type d -exec rm -r "{}" \;


all: run

rules :=	all				    \
			install  \
			compile				\
			run					\
			install				\
			lint				\
			lint-error		    \
			clean		        \
			clean-all		    

.PHONY: $(rules)
.SILENT: $(rules) node_modules

# Local makefile to modify flags
-include local.mk
