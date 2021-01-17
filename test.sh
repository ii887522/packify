docker run --rm --name packify_tester -w /packify -v $PWD:/packify packify-custom-node /bin/sh -c "chmod 777 /root && ncu -u && npm install && npx tsc && npm test"
