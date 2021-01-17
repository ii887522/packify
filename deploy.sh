docker run --rm --name packify_publisher -it -w /packify -v $PWD:/packify node:15.4.0-alpine3.10 /bin/sh -c "npm login && npm publish --access public"
