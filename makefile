
clean:
	rm -rf ./build/

test:
	clear \
	&& npm run test:unit \
	&& npm run test:db \
	&& npm run test:e2e

buildDocker:
	docker build -t monsters/monsters-gateway .

buildTestDocker:
	docker build --build-arg NODE_ENV=testDev -t monsters/monsters-gateway-test .
