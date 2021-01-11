docker run --rm --name packify_tester -w /packify -v $PWD:/packify packify-custom-node ncu -u && npm install && npx tsc && npm test
