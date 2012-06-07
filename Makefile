all: bootstrap test

bootstrap:
	node bootstrap.js

test:
	./node_modules/.bin/mocha \
		--require should

.PHONY: test