docker run --rm --name packify_publisher -w /packify -v $PWD:/packify node:15.4.0-alpine3.10 npm login && npm publish --access public
