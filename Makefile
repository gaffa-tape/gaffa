VERSION=0.1
DATE=$(shell DATE)
GAFFA_FILE = gaffa.js
GAFFA_SRC = ./${GAFFA_FILE}
GAFFA_MIN = ./gaffa.min.js
ACTIONS_FOLDER = ./bundles/basic/src/actions/
VIEWS_FOLDER = ./bundles/basic/src/views/
DROP_FOLDERS = ./examples/node/public/scripts/ ./examples/html/scripts/
LESS_COMPRESSOR ?= `which lessc`
UGLIFY_JS ?= `which uglifyjs`

build:
	@@if test ! -z ${UGLIFY_JS}; then \
		echo "build @ "${DATE}; \
		echo "minifying source";\
		uglifyjs -o ${GAFFA_MIN} ${GAFFA_SRC};\
		for dropFolder in ${DROP_FOLDERS}; do \
			echo "copying to drop folder:" $$dropFolder;\
			cp $(GAFFA_SRC) $$dropFolder;\
			for viewFile in ${VIEWS_FOLDER}*.js; do \
				cat $$viewFile >> $$dropFolder/views.js; \
			done; \
			for actionFile in ${ACTIONS_FOLDER}*.js; do \
				cat $$actionFile >> $$dropFolder/actions.js; \
			done; \
		done; \
		echo "complete";\
	else \
		echo "You must have the UGLIFYJS minifier installed in order to minify gaffa.js."; \
		echo "You can install it by running: (sudo) npm install uglify-js -g"; \
	fi