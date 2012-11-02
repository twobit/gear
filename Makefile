all: bootstrap test

bootstrap:
	node bootstrap.js

test:
	npm test

test-cov: lib-cov
	@GEAR_COV=1 mocha --require should --reporter html-cov > coverage.html

lib-cov:
	@jscoverage lib lib-cov

.PHONY: test
