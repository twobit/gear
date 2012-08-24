all: bootstrap test

bootstrap:
	node bootstrap.js

test:
	npm test

.PHONY: test